--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `enforce_tfa` tinyint NOT NULL DEFAULT '0',
  `app_access` tinyint NOT NULL DEFAULT '0',
  `admin_access` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `language` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expiration` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `commune` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `identity_verified` tinyint NOT NULL DEFAULT '0',
  `email_verified` tinyint NOT NULL DEFAULT '0',
  `phone_number_verified` tinyint NOT NULL DEFAULT '0',
  `auth_login_attempts` int NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `updated_by` varchar(255) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `role_id` varchar(36) DEFAULT NULL,
  `avatar_id` varchar(36) DEFAULT NULL,
  `additional_data_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_data`
--

CREATE TABLE `users_data` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `lieu_naissance` varchar(255) DEFAULT NULL,
  `activite` varchar(255) DEFAULT NULL,
  `nom_entreprise` varchar(255) DEFAULT NULL,
  `email_entreprise` varchar(255) DEFAULT NULL,
  `numero_contribuable` varchar(255) DEFAULT NULL,
  `type_entreprise` varchar(255) DEFAULT NULL,
  `photo_identite_id` varchar(36) DEFAULT NULL,
  `piece_identite_id` varchar(36) DEFAULT NULL,
  `registre_commerce_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------

--
-- Table structure for table `villes`
--

CREATE TABLE `villes` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communes`
--

CREATE TABLE `communes` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `ville_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` varchar(36) NOT NULL,
  `filename_disk` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `filename_download` varchar(255) DEFAULT NULL,
  `storage` varchar(255) DEFAULT 'minio',
  `external_file_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `folder` varchar(255) DEFAULT NULL,
  `charset` varchar(255) DEFAULT NULL,
  `filesize` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `embed` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `focal_point_x` int DEFAULT NULL,
  `focal_point_y` int DEFAULT NULL,
  `tus_id` varchar(255) DEFAULT NULL,
  `tus_data` json DEFAULT NULL,
  `uploaded_by` varchar(36) DEFAULT NULL,
  `uploaded_on` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `modified_by` varchar(36) DEFAULT NULL,
  `modified_on` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_on` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `configurations`
--

CREATE TABLE `configurations` (
  `id` varchar(36) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

