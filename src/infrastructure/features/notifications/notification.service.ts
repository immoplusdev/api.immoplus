import axios from "axios";
import {
  IMailService,
  INotificationService,
  ISmsService,
  OneSignalResponse,
  SendNotificationParams,
  SendBulkNotificationByRolesParams,
  BulkNotificationResult,
} from "@/core/domain/notifications";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { Role, UserRole } from "@/core/domain/roles";
import {
  IUserRepository,
  UserNotFoundException,
  UserStatus,
} from "@/core/domain/users";
import { ILoggerService } from "@/core/domain/logging";

export class NotificationService implements INotificationService {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.MailService) private readonly mailService: IMailService,
    @Inject(Deps.SmsService) private readonly smsService: ISmsService,
    @Inject(Deps.LoggerService) private readonly loggerService: ILoggerService,
  ) {}

  async sendNotification(params: SendNotificationParams) {
    const user = await this.usersRepository.findOne(params.userId);
    if (!user) throw new UserNotFoundException();

    if (params.sendMail == true) {
      try {
        await this.mailService.sendMail({
          to: user.email,
          subject: params.subject,
          text: params.htmlMessage || params.message,
        });
      } catch (error) {
        this.loggerService.error(`[Send Mail] Test failed: ${error}`);
      }
    }

    if (params.sendSms == true) {
      try {
        await this.smsService.sendSms([user.phoneNumber], params.message);
      } catch (error) {
        this.loggerService.error(error. (), error);
      }
    }

    if (params.skipInAppNotification == false) {
      try {
        await this.sendOneSignalNotification(
          params,
          (user.role as Role)?.id as UserRole,
        );
      } catch (error) {
        this.loggerService.error(`[Send SMS] Test failed: ${error}`);
      }
    }
  }

  async sendBulkNotificationByRoles(
    params: SendBulkNotificationByRolesParams,
  ): Promise<BulkNotificationResult> {
    try {
      this.loggerService.info(
        `[Bulk Notification] Starting broadcast to roles: ${params.roles.join(", ")}`,
      );

      // 1. Fetch all users for the specified roles
      const allUsers = [];

      // Group roles by OneSignal app to optimize queries
      const customerRoles = params.roles.filter((r) => r === UserRole.Customer);
      const proRoles = params.roles.filter(
        (r) => r === UserRole.ProEntreprise || r === UserRole.ProParticulier,
      );

      // Fetch Customer users if needed
      if (customerRoles.length > 0) {
        this.loggerService.info(
          `[Bulk Notification] Fetching Customer role users...`,
        );
        const customerUsers = await this.usersRepository.findByQuery({
          _where: [
            { _field: "role", _op: "in", _val: customerRoles },
            { _field: "status", _val: UserStatus.Active, _l_op: "and" },
          ],
        });

        allUsers.push(...customerUsers.data);
      }

      // Fetch Pro users if needed
      if (proRoles.length > 0) {
        this.loggerService.info(
          `[Bulk Notification] Fetching Pro role users...`,
        );
        const proUsers = await this.usersRepository.findByQuery({
          _where: [
            { _field: "role", _op: "in", _val: proRoles },
            { _field: "status", _val: UserStatus.Active, _l_op: "and" },
          ],
        });
        allUsers.push(...proUsers.data);
      }

      const totalTargeted = allUsers.length;
      this.loggerService.info(
        `[Bulk Notification] Total users targeted: ${totalTargeted}`,
      );

      if (totalTargeted === 0) {
        this.loggerService.warn(
          `[Bulk Notification] No users found for roles: ${params.roles.join(", ")}`,
        );
        return {
          totalTargeted: 0,
          successful: 0,
          failed: 0,
        };
      }

      // 2. Send notifications to all users using Promise.allSettled
      this.loggerService.info(
        `[Bulk Notification] Sending notifications to ${totalTargeted} users...`,
      );

      const results = await Promise.allSettled(
        allUsers.map((user) =>
          this.sendOneSignalNotification(
            {
              userId: user.id,
              subject: params.subject,
              message: params.message,
              data: params.data,
              url: params.url,
              skipInAppNotification: false,
            },
            (user.role as Role)?.id as UserRole,
            params.imageUrl,
          ),
        ),
      );

      // 3. Analyze results
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      const errors = results
        .map((r, index) => {
          if (r.status === "rejected") {
            return {
              userId: allUsers[index].id,
              error: r.reason?.message || "Unknown error",
            };
          }
          return null;
        })
        .filter((e) => e !== null);

      this.loggerService.info(
        `[Bulk Notification] Broadcast completed - Success: ${successful}, Failed: ${failed}`,
      );

      if (errors.length > 0) {
        this.loggerService.warn(
          `[Bulk Notification] Errors encountered:`,
          errors,
        );
      }

      return {
        totalTargeted,
        successful,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      this.loggerService.error(
        `[Bulk Notification] Fatal error during broadcast:`,
        error,
      );
      throw error;
    }
  }

  private async sendOneSignalNotification(
    params: SendNotificationParams,
    userRole?: UserRole,
    imageUrl?: string,
  ): Promise<OneSignalResponse> {
    try {
      // 1. Validation des paramètres d'entrée
      if (!params.userId?.trim()) {
        throw new Error(
          "[OneSignal] userId est requis et ne peut pas être vide",
        );
      }

      if (!params.subject?.trim() || !params.message?.trim()) {
        throw new Error("[OneSignal] subject et message sont requis");
      }

      console.log(
        `[OneSignal] Envoi notification - userId: ${params.userId}, role: ${userRole || "undefined"}`,
      );

      // 2. Récupération et validation des credentials
      const credentials = await this.getOneSignalCredentials(userRole);

      // 3. Construction du payload OneSignal
      const notificationData: any = {
        app_id: credentials.app_id,
        headings: {
          en: params.subject,
          // Ajout d'autres langues si nécessaire
          fr: params.subject,
        },
        contents: {
          en: params.message,
          fr: params.message,
        },
        include_external_user_ids: [params.userId],

        // Configuration supplémentaire recommandée
        channel_for_external_user_ids: "push", // Canal de notification

        // Données personnalisées (optionnel)
        ...(params.data && { data: params.data }),

        // URL d'action (optionnel)
        ...(params.url && { url: params.url }),

        // Image (Android big picture & iOS attachments)
        ...(imageUrl && {
          big_picture: imageUrl, // Android
          ios_attachments: { id1: imageUrl }, // iOS
        }),

        // Configuration de comportement
        content_available: true, // Pour iOS background processing
        mutable_content: true, // Pour iOS notification extensions

        // Priorité et délai
        priority: 10, // Haute priorité
        delayed_option: "immediate",
      };

      console.log(`[OneSignal] Payload préparé:`, {
        app_id: credentials.app_id,
        recipients_count: 1,
        external_user_id: params.userId,
        has_custom_data: !!params.data,
        has_url: !!params.url,
      });

      // 4. Configuration de la requête
      const config = {
        headers: {
          Authorization: `Basic ${credentials.api_key}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000, // 15 secondes
        validateStatus: (status: number) => status < 500, // Accepter les 4xx pour les traiter
      };

      // 5. Envoi de la notification
      const response = await axios.post<OneSignalResponse>(
        "https://onesignal.com/api/v1/notifications",
        notificationData,
        config,
      );

      // 6. Analyse de la réponse
      const result = response.data;

      console.log(`[OneSignal] Réponse reçue:`, {
        id: result.id,
        recipients: result.recipients,
        status: response.status,
        has_errors: !!result.errors,
      });

      // 7. Gestion des erreurs spécifiques OneSignal
      if (response.status >= 400) {
        console.error(`[OneSignal] Erreur HTTP ${response.status}:`, result);
        throw new Error(
          `OneSignal API error ${response.status}: ${JSON.stringify(result)}`,
        );
      }

      // 8. Vérification des erreurs dans la réponse réussie
      if (result.errors) {
        const errors = result.errors;

        if (errors.invalid_external_user_ids?.includes(params.userId)) {
          console.warn(
            `[OneSignal] External user ID invalide: ${params.userId}`,
          );
          throw new Error(
            `Utilisateur ${params.userId} non trouvé dans OneSignal`,
          );
        }

        if (errors.invalid_player_ids && errors.invalid_player_ids.length > 0) {
          console.warn(
            `[OneSignal] Player IDs invalides:`,
            errors.invalid_player_ids,
          );
        }

        console.warn(`[OneSignal] Erreurs dans la réponse:`, errors);
      }

      // 9. Vérification du nombre de destinataires
      if (result.recipients === 0) {
        console.warn(
          `[OneSignal] Notification envoyée mais aucun destinataire atteint pour userId: ${params.userId}`,
        );
        // Ne pas throw ici car c'est techniquement un succès OneSignal
      }

      console.log(
        `[OneSignal] Notification envoyée avec succès - ID: ${result.id}, Recipients: ${result.recipients}`,
      );
      return result;
    } catch (error) {
      // Logging détaillé de l'erreur
      console.error(`[OneSignal] Échec envoi notification:`, {
        userId: params.userId,
        userRole: userRole || "undefined",
        error_message: error.message,
        error_type: error.constructor.name,
        response_status: error.response?.status,
        response_data: error.response?.data,
        is_timeout: error.code === "ECONNABORTED",
        is_network: error.code === "ECONNREFUSED" || error.code === "ENOTFOUND",
      });

      // Relancer avec contexte enrichi
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        // Messages d'erreur plus explicites selon le status
        switch (status) {
          case 400:
            throw new Error(
              `[OneSignal] Requête invalide - Vérifiez les paramètres: ${JSON.stringify(errorData)}`,
            );
          case 401:
            throw new Error(
              `[OneSignal] Authentification échouée - Vérifiez l'API key`,
            );
          case 404:
            throw new Error(
              `[OneSignal] App ID non trouvé - Vérifiez la configuration`,
            );
          case 429:
            throw new Error(
              `[OneSignal] Limite de taux atteinte - Réessayez plus tard`,
            );
          default:
            throw new Error(
              `[OneSignal] Erreur API ${status}: ${JSON.stringify(errorData)}`,
            );
        }
      }
    }
  }

  private async getOneSignalCredentials(userRole?: UserRole) {
    try {
      // Gestion explicite du cas undefined
      const keyPrefix = userRole === UserRole.Customer ? "CLIENT" : "PRO";

      console.log(
        `[OneSignal] Récupération credentials pour rôle: ${userRole || "undefined"} -> ${keyPrefix}`,
      );

      let app_id: string = "";
      let api_key: string = "";

      // Get credentials for Customer
      if (userRole === UserRole.Customer) {
        app_id =
          this.configsManagerService.getEnvVariable(
            "ONE_SIGNAL_CLIENT_APP_ID",
          ) ?? "3dcf3bc5-e4c7-4328-9d30-0f33cdedb1f0";
        api_key =
          this.configsManagerService.getEnvVariable(
            "ONE_SIGNAL_CLIENT_API_KEY",
          ) ?? "ZjViY2JhM2ItYTExZC00Mzk4LTg4ZmItODcwZWI1MWJlMjQ2";
      }

      // Get credentials for Pro
      if (
        userRole === UserRole.ProEntreprise ||
        userRole === UserRole.ProParticulier
      ) {
        app_id = "7eb65c1b-a1c3-4bd2-9a3c-955743582362";
        api_key =
          "os_v2_app_p23fyg5bynf5fgr4svlugwbdmlqsx4eocraewqm3znsutbhju52ye6dbjtfcbk76fi556ueqdil72pkhuaurtfiik5labc75psf3rgi";
      }

      // Validation du format OneSignal
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(app_id)) {
        throw new Error(
          `Format app_id invalide pour ${keyPrefix} - doit être un UUID`,
        );
      }

      console.log(
        `[OneSignal] credentials récupérées pour rôle: ${userRole || "undefined"} {app_id: ${app_id}, api_key: ${api_key}}`,
      );

      return { app_id, api_key };
    } catch (error) {
      console.error(
        `[OneSignal] Erreur configuration credentials:`,
        error.message,
      );
      throw error;
    }
  }
}
