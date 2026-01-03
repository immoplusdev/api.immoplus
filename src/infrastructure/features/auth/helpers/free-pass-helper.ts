import { FREE_PASS_EMAIL_DOMAIN } from "@/infrastructure/configs/auth";

export function isFreePassEmail(email: string) {
    return email.endsWith(FREE_PASS_EMAIL_DOMAIN);
}