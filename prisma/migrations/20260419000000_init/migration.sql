-- CreateTable
CREATE TABLE `site_profile` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `focus` VARCHAR(191) NOT NULL,
    `hero_headline` VARCHAR(512) NOT NULL,
    `hero_sub` TEXT NOT NULL,
    `github_url` VARCHAR(512) NOT NULL,
    `linkedin_url` VARCHAR(512) NOT NULL,
    `email_mailto` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stack_group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `icon_key` VARCHAR(32) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stack_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NOT NULL,
    `label` VARCHAR(512) NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `icon_url` VARCHAR(1024) NULL,
    `accent_color` VARCHAR(32) NULL,

    INDEX `stack_item_group_id_idx`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experience_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experience_highlight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `detail` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `experience_highlight_role_id_idx`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `highlight_metric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `highlight_id` INTEGER NOT NULL,
    `text` VARCHAR(512) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `highlight_metric_highlight_id_idx`(`highlight_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `problem` TEXT NOT NULL,
    `solution` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_stack_tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `tag` VARCHAR(512) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `project_stack_tag_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_impact_line` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `line` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `project_impact_line_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `href` VARCHAR(1024) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `project_link_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_design_card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(191) NOT NULL,
    `angle` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NOT NULL,
    `tone` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stack_item` ADD CONSTRAINT `stack_item_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `stack_group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experience_highlight` ADD CONSTRAINT `experience_highlight_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `experience_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `highlight_metric` ADD CONSTRAINT `highlight_metric_highlight_id_fkey` FOREIGN KEY (`highlight_id`) REFERENCES `experience_highlight`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_stack_tag` ADD CONSTRAINT `project_stack_tag_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_impact_line` ADD CONSTRAINT `project_impact_line_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_link` ADD CONSTRAINT `project_link_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

