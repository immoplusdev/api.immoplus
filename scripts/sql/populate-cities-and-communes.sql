DELETE FROM villes;
DELETE FROM communes;


-- Insert villes with UUIDs
INSERT INTO villes (id, name) VALUES
                                  (UUID(), 'Abidjan'),
                                  (UUID(), 'Yamoussoukro'),
                                  (UUID(), 'Bouaké'),
                                  (UUID(), 'Daloa'),
                                  (UUID(), 'San-Pédro'),
                                  (UUID(), 'Korhogo'),
                                  (UUID(), 'Man'),
                                  (UUID(), 'Gagnoa'),
                                  (UUID(), 'Divo'),
                                  (UUID(), 'Abengourou'),
                                  (UUID(), 'Anyama'),
                                  (UUID(), 'Soubre'),
                                  (UUID(), 'Bondoukou'),
                                  (UUID(), 'Ferkessédougou'),
                                  (UUID(), 'Odienné'),
                                  (UUID(), 'Séguéla'),
                                  (UUID(), 'Toumodi'),
                                  (UUID(), 'Aboisso'),
                                  (UUID(), 'Agboville'),
                                  (UUID(), 'Grand-Bassam'),
                                  (UUID(), 'Adzopé'),
                                  (UUID(), 'Issia');

-- Insert communes with UUIDs and corresponding city UUIDs
INSERT INTO communes (id, name, ville_id) VALUES
-- Abidjan
(UUID(), 'Cocody', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Yopougon', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Plateau', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Marcory', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Treichville', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Abobo', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Koumassi', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Port-Bouët', (SELECT id FROM villes WHERE name = 'Abidjan')),
(UUID(), 'Attécoubé', (SELECT id FROM villes WHERE name = 'Abidjan')),
-- Yamoussoukro
(UUID(), 'Dioulabougou', (SELECT id FROM villes WHERE name = 'Yamoussoukro')),
(UUID(), 'Kokrenou', (SELECT id FROM villes WHERE name = 'Yamoussoukro')),
(UUID(), 'Morofé', (SELECT id FROM villes WHERE name = 'Yamoussoukro')),
(UUID(), 'Nanan', (SELECT id FROM villes WHERE name = 'Yamoussoukro')),
-- Bouaké
(UUID(), 'Dar-Es-Salam', (SELECT id FROM villes WHERE name = 'Bouaké')),
(UUID(), 'Ahougnassou', (SELECT id FROM villes WHERE name = 'Bouaké')),
(UUID(), 'Koko', (SELECT id FROM villes WHERE name = 'Bouaké')),
(UUID(), 'Belleville', (SELECT id FROM villes WHERE name = 'Bouaké')),
-- Daloa
(UUID(), 'Labia', (SELECT id FROM villes WHERE name = 'Daloa')),
(UUID(), 'Orly', (SELECT id FROM villes WHERE name = 'Daloa')),
(UUID(), 'Marahoué', (SELECT id FROM villes WHERE name = 'Daloa')),
-- San-Pédro
(UUID(), 'Séwé', (SELECT id FROM villes WHERE name = 'San-Pédro')),
(UUID(), 'Lacroix', (SELECT id FROM villes WHERE name = 'San-Pédro')),
(UUID(), 'Bardot', (SELECT id FROM villes WHERE name = 'San-Pédro')),
-- Korhogo
(UUID(), 'Sinistré', (SELECT id FROM villes WHERE name = 'Korhogo')),
(UUID(), 'Toumian', (SELECT id FROM villes WHERE name = 'Korhogo')),
(UUID(), 'Nagnan', (SELECT id FROM villes WHERE name = 'Korhogo')),
-- Man
(UUID(), 'Kpangbassou', (SELECT id FROM villes WHERE name = 'Man')),
(UUID(), 'Bablénou', (SELECT id FROM villes WHERE name = 'Man')),
(UUID(), 'Yopé', (SELECT id FROM villes WHERE name = 'Man')),
-- Gagnoa
(UUID(), 'Garahio', (SELECT id FROM villes WHERE name = 'Gagnoa')),
(UUID(), 'Barouhio', (SELECT id FROM villes WHERE name = 'Gagnoa')),
(UUID(), 'Dougroupalégnoa', (SELECT id FROM villes WHERE name = 'Gagnoa')),
-- Divo
(UUID(), 'Balékro', (SELECT id FROM villes WHERE name = 'Divo')),
(UUID(), 'Konankro', (SELECT id FROM villes WHERE name = 'Divo')),
(UUID(), 'Guitry', (SELECT id FROM villes WHERE name = 'Divo')),
-- Abengourou
(UUID(), 'Méréméré', (SELECT id FROM villes WHERE name = 'Abengourou')),
(UUID(), 'Ebilassokro', (SELECT id FROM villes WHERE name = 'Abengourou')),
(UUID(), 'Anoumabo', (SELECT id FROM villes WHERE name = 'Abengourou')),
-- Anyama
(UUID(), 'Ebly', (SELECT id FROM villes WHERE name = 'Anyama')),
(UUID(), 'Bingerville', (SELECT id FROM villes WHERE name = 'Anyama')),
(UUID(), 'Agban', (SELECT id FROM villes WHERE name = 'Anyama')),
-- Soubre
(UUID(), 'Okrouyo', (SELECT id FROM villes WHERE name = 'Soubre')),
(UUID(), 'Léléblé', (SELECT id FROM villes WHERE name = 'Soubre')),
(UUID(), 'Gnipi', (SELECT id FROM villes WHERE name = 'Soubre')),
-- Bondoukou
(UUID(), 'Tabagne', (SELECT id FROM villes WHERE name = 'Bondoukou')),
(UUID(), 'Sorobango', (SELECT id FROM villes WHERE name = 'Bondoukou')),
(UUID(), 'Laoudi-Ba', (SELECT id FROM villes WHERE name = 'Bondoukou')),
-- Ferkessédougou
(UUID(), 'Lataha', (SELECT id FROM villes WHERE name = 'Ferkessédougou')),
(UUID(), 'Naminia', (SELECT id FROM villes WHERE name = 'Ferkessédougou')),
(UUID(), 'Kasséré', (SELECT id FROM villes WHERE name = 'Ferkessédougou')),
-- Odienné
(UUID(), 'Bougousso', (SELECT id FROM villes WHERE name = 'Odienné')),
(UUID(), 'Séguélon', (SELECT id FROM villes WHERE name = 'Odienné')),
(UUID(), 'Tiémé', (SELECT id FROM villes WHERE name = 'Odienné')),
-- Séguéla
(UUID(), 'Massala', (SELECT id FROM villes WHERE name = 'Séguéla')),
(UUID(), 'Koumbala', (SELECT id FROM villes WHERE name = 'Séguéla')),
(UUID(), 'Kani', (SELECT id FROM villes WHERE name = 'Séguéla')),
-- Toumodi
(UUID(), 'Gbogou', (SELECT id FROM villes WHERE name = 'Toumodi')),
(UUID(), 'Bangoua', (SELECT id FROM villes WHERE name = 'Toumodi')),
(UUID(), 'Kouadio-Niango', (SELECT id FROM villes WHERE name = 'Toumodi')),
-- Aboisso
(UUID(), 'Ehania', (SELECT id FROM villes WHERE name = 'Aboisso')),
(UUID(), 'Ayamé', (SELECT id FROM villes WHERE name = 'Aboisso')),
(UUID(), 'Aboisso-Comoé', (SELECT id FROM villes WHERE name = 'Aboisso')),
-- Agboville
(UUID(), 'Oress-Krobou', (SELECT id FROM villes WHERE name = 'Agboville')),
(UUID(), 'Azaguié', (SELECT id FROM villes WHERE name = 'Agboville')),
(UUID(), 'Rubino', (SELECT id FROM villes WHERE name = 'Agboville')),
-- Grand-Bassam
(UUID(), 'Azuretti', (SELECT id FROM villes WHERE name = 'Grand-Bassam')),
(UUID(), 'Bonoua', (SELECT id FROM villes WHERE name = 'Grand-Bassam')),
(UUID(), 'Ebrah', (SELECT id FROM villes WHERE name = 'Grand-Bassam')),
-- Adzopé
(UUID(), 'Yakassé', (SELECT id FROM villes WHERE name = 'Adzopé')),
(UUID(), 'Assikoi', (SELECT id FROM villes WHERE name = 'Adzopé')),
(UUID(), 'Akoupé', (SELECT id FROM villes WHERE name = 'Adzopé')),
-- Issia
(UUID(), 'Sahuyé', (SELECT id FROM villes WHERE name = 'Issia')),
(UUID(), 'Zérahio', (SELECT id FROM villes WHERE name = 'Issia')),
(UUID(), 'Gnahio', (SELECT id FROM villes WHERE name = 'Issia'));
