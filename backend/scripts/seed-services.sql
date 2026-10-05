-- =========================================
-- Données de base : les 3 services principaux
-- Les pages /engineering, /domotics et /display appellent
-- GET /api/services/<slug> avec ces slugs exacts.
--
-- Ré-exécutable sans risque (INSERT IGNORE sur le slug UNIQUE) :
--   mysql -u inovamakers_user -p inovamakers < backend/scripts/seed-services.sql
-- =========================================

USE inovamakers;

INSERT IGNORE INTO services
  (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT
  'Ingénierie', 'engineering',
  'Conseil en innovation, objets connectés et solutions IoT.',
  'Conseil stratégique en innovation, conception d''objets connectés et développement de solutions IoT pour transformer votre activité.',
  c.id, 'cpu', 'blue-500', 'blue-500/10',
  JSON_ARRAY('Conseil stratégie innovation', 'Conception d''objets connectés', 'Développement IoT', 'Intégration systèmes'),
  1
FROM categories c WHERE c.slug = 'engineering';

INSERT IGNORE INTO services
  (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT
  'Domotique & Énergie', 'domotics-service',
  'Habitat intelligent, énergie solaire et sécurité connectée.',
  'Solutions complètes pour automatiser votre habitat : énergie solaire, gestion énergétique et sécurité connectée pour un confort optimal.',
  c.id, 'home', 'emerald-500', 'emerald-500/10',
  JSON_ARRAY('Éclairage intelligent', 'Énergie solaire', 'Gestion énergétique', 'Contrôle d''accès'),
  2
FROM categories c WHERE c.slug = 'domotics-service';

INSERT IGNORE INTO services
  (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT
  'Affichage', 'display',
  'Écrans LED géants, enseignes dynamiques et affichage numérique.',
  'Conception et installation d''écrans LED géants, enseignes dynamiques et systèmes d''affichage numérique pour maximiser votre visibilité.',
  c.id, 'monitor', 'orange-500', 'orange-500/10',
  JSON_ARRAY('Écrans LED géants', 'Horloges LED', 'Écrans informatifs', 'Installation et maintenance'),
  3
FROM categories c WHERE c.slug = 'display';
