SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM typeorm_migrations WHERE id != ""
DELETE FROM users WHERE id != ""
DELETE FROM users_data WHERE id != ""
DELETE FROM roles WHERE id != ""
DELETE FROM permissions WHERE id != ""
DELETE FROM villes WHERE id != ""
DELETE FROM communes WHERE id != ""
