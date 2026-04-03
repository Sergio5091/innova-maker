const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inovamakers',
  waitForConnections: true,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

const products = [
  {
    name: "Écran LED Professionnel P4",
    description: "Écran LED intérieur haute résolution pour affichage dynamique. Idéal pour les boutiques, restaurants et centres commerciaux.",
    price: 2500000,
    currency: "FCFA",
    category: "led",
    rating: 4.8,
    reviews_count: 24,
    badge: "Populaire",
    stock_quantity: 15,
    specifications: {
      resolution: "P4 (4mm)",
      dimensions: "2m x 1m",
      brightness: "1000 nits",
      warranty: "2 ans"
    }
  },
  {
    name: "Écran LED Extérieur P10",
    description: "Écran LED résistant aux intempéries pour affichage publicitaire extérieur. Parfait pour les panneaux d'affichage et événements.",
    price: 4800000,
    currency: "FCFA",
    category: "led",
    rating: 4.9,
    reviews_count: 18,
    badge: "Premium",
    stock_quantity: 8,
    specifications: {
      resolution: "P10 (10mm)",
      dimensions: "3m x 2m",
      brightness: "6500 nits",
      waterproof: "IP65",
      warranty: "3 ans"
    }
  },
  {
    name: "Horloge Numérique Géante",
    description: "Horloge LED grand format avec synchronisation automatique. Affichage clair et visible de loin pour les espaces publics.",
    price: 850000,
    currency: "FCFA",
    category: "clocks",
    rating: 4.7,
    reviews_count: 31,
    stock_quantity: 22,
    specifications: {
      display: "LED 7 segments",
      size: "60cm x 20cm",
      power: "12V DC",
      features: ["Auto-sync", "Température", "Date"]
    }
  },
  {
    name: "Kit Solaire Résidentiel 5kW",
    description: "Solution solaire complète avec panneaux et onduleur. Installation tout-en-un pour l'autoconsommation résidentielle.",
    price: 3200000,
    currency: "FCFA",
    category: "solar",
    rating: 4.9,
    reviews_count: 42,
    badge: "Meilleure vente",
    stock_quantity: 12,
    specifications: {
      power: "5kW",
      panels: "10 x 500W",
      inverter: "5kW Hybrid",
      battery: "10kWh LiFePO4",
      warranty: "25 ans panneaux"
    }
  },
  {
    name: "Kit Solaire Commercial 10kW",
    description: "Installation solaire pour entreprises et commerces. Solution robuste pour réduire les factures d'électricité.",
    price: 5800000,
    currency: "FCFA",
    category: "solar",
    rating: 4.8,
    reviews_count: 15,
    stock_quantity: 6,
    specifications: {
      power: "10kW",
      panels: "20 x 500W",
      inverter: "10kW Three Phase",
      battery: "20kWh LiFePO4",
      monitoring: "WiFi + GSM"
    }
  },
  {
    name: "Module Domotique Central",
    description: "Hub central pour contrôler tous vos appareils connectés. Compatible avec les protocoles Zigbee, Z-Wave et WiFi.",
    price: 450000,
    currency: "FCFA",
    category: "domotics",
    rating: 4.6,
    reviews_count: 28,
    badge: "Nouveau",
    stock_quantity: 30,
    specifications: {
      protocols: ["Zigbee 3.0", "Z-Wave", "WiFi", "Bluetooth"],
      connectivity: "Ethernet + WiFi",
      storage: "32GB",
      backup: "Battery 4h"
    }
  },
  {
    name: "Thermostat Intelligent",
    description: "Contrôle climatique automatisé avec apprentissage IA. Économise jusqu'à 30% sur vos factures de climatisation.",
    price: 175000,
    currency: "FCFA",
    category: "domotics",
    rating: 4.7,
    reviews_count: 56,
    stock_quantity: 45,
    specifications: {
      display: "LCD Touch 4.3\"",
      sensors: ["Température", "Humidité", "Présence"],
      learning: "Machine Learning",
      mobile_app: "iOS + Android"
    }
  },
  {
    name: "Capteur IoT Multi-fonction",
    description: "Capteur connecté température, humidité et qualité d'air. Monitoring en temps réel via application mobile.",
    price: 85000,
    currency: "FCFA",
    category: "iot",
    rating: 4.5,
    reviews_count: 33,
    stock_quantity: 100,
    specifications: {
      sensors: ["Température", "Humidité", "CO2", "PM2.5"],
      connectivity: "LoRaWAN + WiFi",
      battery: "2 ans",
      range: "10km LoRa"
    }
  },
  {
    name: "Gateway IoT Industriel",
    description: "Passerelle pour connecter vos équipements industriels. Supporte plus de 1000 capteurs simultanément.",
    price: 650000,
    currency: "FCFA",
    category: "iot",
    rating: 4.8,
    reviews_count: 12,
    badge: "Pro",
    stock_quantity: 18,
    specifications: {
      protocols: ["Modbus", "MQTT", "OPC-UA", "LoRaWAN"],
      ports: ["4xEthernet", "2xRS485", "USB"],
      storage: "1TB SSD",
      redundancy: "Dual PSU"
    }
  },
  {
    name: "Caméra de Surveillance IP",
    description: "Caméra HD avec vision nocturne et détection de mouvement. Idéale pour la sécurité résidentielle et commerciale.",
    price: 120000,
    currency: "FCFA",
    category: "domotics",
    rating: 4.6,
    reviews_count: 67,
    stock_quantity: 85,
    specifications: {
      resolution: "4MP (2560x1440)",
      night_vision: "30m IR",
      detection: "Motion + Human",
      storage: "MicroSD 256GB",
      mobile_app: "iOS + Android"
    }
  },
  {
    name: "Panneau LED Publicitaire",
    description: "Enseigne LED programmable pour commerces. Design moderne avec gestionnaire de contenu intégré.",
    price: 1200000,
    currency: "FCFA",
    category: "led",
    rating: 4.7,
    reviews_count: 22,
    stock_quantity: 25,
    specifications: {
      resolution: "P6 (6mm)",
      dimensions: "1.5m x 0.8m",
      brightness: "5500 nits",
      control: "WiFi + USB",
      software: "Windows + Android"
    }
  },
  {
    name: "Horloge Murale LED",
    description: "Horloge décorative LED pour bureaux et commerces. Design élégant avec affichage température et date.",
    price: 280000,
    currency: "FCFA",
    category: "clocks",
    rating: 4.5,
    reviews_count: 19,
    stock_quantity: 35,
    specifications: {
      display: "LED Matrix",
      size: "40cm x 15cm",
      features: ["Heure", "Date", "Température", "Alarme"],
      power: "Adapter 12V",
      colors: "RGB"
    }
  }
];

const coupons = [
  {
    code: "BIENVENUE10",
    description: "10% de réduction sur votre première commande",
    discount_type: "percentage",
    discount_value: 10,
    minimum_amount: 100000,
    usage_limit: 100,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 jours
  },
  {
    code: "SOLAIRE5000",
    description: "5000 FCFA de réduction sur les kits solaires",
    discount_type: "fixed",
    discount_value: 5000,
    minimum_amount: 1000000,
    usage_limit: 50,
    expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 jours
  }
];

async function seed() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('🌱 Début du peuplement de la base de données...');
    
    // Insérer les produits
    for (const product of products) {
      await pool.execute(`
        INSERT INTO products (name, description, price, currency, category, rating, reviews_count, badge, stock_quantity, specifications, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        product.name,
        product.description,
        product.price,
        product.currency,
        product.category,
        product.rating,
        product.reviews_count,
        product.badge,
        product.stock_quantity,
        JSON.stringify(product.specifications)
      ]);
    }

    console.log(`✅ ${products.length} produits insérés avec succès !`);

    // Insérer les coupons
    for (const coupon of coupons) {
      await pool.execute(`
        INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, usage_limit, starts_at, expires_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, TRUE)
      `, [
        coupon.code,
        coupon.description,
        coupon.discount_type,
        coupon.discount_value,
        coupon.minimum_amount,
        coupon.usage_limit,
        coupon.expires_at
      ]);
    }

    console.log(`✅ ${coupons.length} coupons de réduction créés !`);
    
    console.log('📦 Base de données prête pour le développement !');
    console.log('👤 Admin: admin@inovamakers.io / admin123');
    console.log('🛒 Boutique: 12 produits technologiques');
    console.log('🎫 Coupons: 2 codes de réduction actifs');
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
