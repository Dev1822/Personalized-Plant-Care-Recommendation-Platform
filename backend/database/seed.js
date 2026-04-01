// database/seed.js - Seeds the database with 200+ plant species
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'plantpal',
  multipleStatements: false,
  ssl: {
    rejectUnauthorized: false
  }
};

// 200+ plant species with ideal care conditions
const plants = [
  // SUCCULENTS & CACTI
  { name: 'Aloe Vera', common_name: 'Aloe', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 40, fertilizer_schedule: 'Once a month in summer', care_difficulty: 'Easy', description: 'Hardy succulent with medicinal gel in leaves.' },
  { name: 'Echeveria elegans', common_name: 'Mexican Snowball', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 35, fertilizer_schedule: 'Once in spring, once in summer', care_difficulty: 'Easy', description: 'Rosette-forming succulent with pale blue-green leaves.' },
  { name: 'Sedum morganianum', common_name: 'Burro\'s Tail', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 40, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Trailing succulent with plump, overlapping leaves.' },
  { name: 'Crassula ovata', common_name: 'Jade Plant', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 25, ideal_humidity: 40, fertilizer_schedule: 'Every 6 months', care_difficulty: 'Easy', description: 'Long-lived succulent with oval fleshy leaves.' },
  { name: 'Haworthia fasciata', common_name: 'Zebra Plant', category: 'Succulent', ideal_light: 'Medium', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 26, ideal_humidity: 40, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Small succulent with white-striped leaves.' },
  { name: 'Opuntia microdasys', common_name: 'Bunny Ears Cactus', category: 'Cactus', ideal_light: 'High', ideal_water_frequency: 21, ideal_temperature_min: 10, ideal_temperature_max: 35, ideal_humidity: 30, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Easy', description: 'Flat-padded cactus resembling bunny ears.' },
  { name: 'Echinocactus grusonii', common_name: 'Golden Barrel Cactus', category: 'Cactus', ideal_light: 'High', ideal_water_frequency: 21, ideal_temperature_min: 10, ideal_temperature_max: 38, ideal_humidity: 25, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Spherical cactus with golden spines.' },
  { name: 'Mammillaria elongata', common_name: 'Lady Finger Cactus', category: 'Cactus', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 35, ideal_humidity: 30, fertilizer_schedule: 'Monthly in summer', care_difficulty: 'Easy', description: 'Cylindrical cactus with golden spines.' },
  { name: 'Gymnocalycium mihanovichii', common_name: 'Moon Cactus', category: 'Cactus', ideal_light: 'Medium', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 40, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Colorful grafted cactus.' },
  { name: 'Euphorbia trigona', common_name: 'African Milk Tree', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 18, ideal_temperature_max: 35, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Tall, columnar succulent resembling a cactus.' },

  // TROPICAL HOUSEPLANTS
  { name: 'Monstera deliciosa', common_name: 'Swiss Cheese Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in spring/summer', care_difficulty: 'Easy', description: 'Iconic split-leaf tropical with dramatic foliage.' },
  { name: 'Fiddle Leaf Fig', common_name: 'Fiddle Leaf Fig', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Hard', description: 'Dramatic large-leaved statement plant.' },
  { name: 'Pothos aureus', common_name: 'Golden Pothos', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Nearly indestructible trailing vine.' },
  { name: 'Philodendron hederaceum', common_name: 'Heartleaf Philodendron', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 16, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Easy', description: 'Heart-shaped leaves on cascading vines.' },
  { name: 'Philodendron bipinnatifidum', common_name: 'Tree Philodendron', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Large-leafed philodendron with deeply lobed leaves.' },
  { name: 'Spathiphyllum wallisii', common_name: 'Peace Lily', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Every 6 weeks in spring/summer', care_difficulty: 'Easy', description: 'Air-purifying plant with white blooms.' },
  { name: 'Dracaena marginata', common_name: 'Dragon Tree', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Slender spiky leaves with red edges.' },
  { name: 'Dracaena fragrans', common_name: 'Corn Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 10, ideal_temperature_min: 16, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Broad arching leaves, great for low light.' },
  { name: 'Sansevieria trifasciata', common_name: 'Snake Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 40, fertilizer_schedule: 'Every 6 weeks in growing season', care_difficulty: 'Easy', description: 'Architectural plant tolerating neglect.' },
  { name: 'ZZ Plant', common_name: 'Zanzibar Gem', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 14, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Glossy leaves on arching stems, very low maintenance.' },

  // FERNS
  { name: 'Nephrolepis exaltata', common_name: 'Boston Fern', category: 'Fern', ideal_light: 'Medium', ideal_water_frequency: 3, ideal_temperature_min: 16, ideal_temperature_max: 24, ideal_humidity: 80, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Lush arching fronds, humidity-loving.' },
  { name: 'Adiantum raddianum', common_name: 'Maidenhair Fern', category: 'Fern', ideal_light: 'Medium', ideal_water_frequency: 3, ideal_temperature_min: 16, ideal_temperature_max: 24, ideal_humidity: 80, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Hard', description: 'Delicate fan-shaped leaflets on thin stems.' },
  { name: 'Asplenium nidus', common_name: 'Bird\'s Nest Fern', category: 'Fern', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 27, ideal_humidity: 70, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Wavy, undivided fronds forming a nest-like rosette.' },
  { name: 'Cyrtomium falcatum', common_name: 'Holly Fern', category: 'Fern', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 24, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Glossy, holly-like leaflets, very tolerant.' },
  { name: 'Polystichum tsus-simense', common_name: 'Korean Rock Fern', category: 'Fern', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 22, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Small, elegant fern with dark green fronds.' },
  { name: 'Platycerium bifurcatum', common_name: 'Staghorn Fern', category: 'Fern', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Mounted fern with antler-shaped fronds.' },

  // PALMS
  { name: 'Chamaedorea elegans', common_name: 'Parlor Palm', category: 'Palm', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 16, ideal_temperature_max: 26, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Elegant small palm great for interiors.' },
  { name: 'Howea forsteriana', common_name: 'Kentia Palm', category: 'Palm', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 16, ideal_temperature_max: 26, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Easy', description: 'Graceful arching fronds, classic houseplant.' },
  { name: 'Rhapis excelsa', common_name: 'Lady Palm', category: 'Palm', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 25, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Multi-stemmed palm with fan-shaped leaves.' },
  { name: 'Dypsis lutescens', common_name: 'Areca Palm', category: 'Palm', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Lush, clumping palm with feathery fronds.' },
  { name: 'Phoenix roebelenii', common_name: 'Pygmy Date Palm', category: 'Palm', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 32, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Compact date palm with graceful arching fronds.' },

  // HERBS
  { name: 'Ocimum basilicum', common_name: 'Basil', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 2, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Aromatic culinary herb needing warmth and sun.' },
  { name: 'Mentha spicata', common_name: 'Spearmint', category: 'Herb', ideal_light: 'Medium', ideal_water_frequency: 2, ideal_temperature_min: 15, ideal_temperature_max: 25, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Vigorous spreading herb with bright flavor.' },
  { name: 'Rosmarinus officinalis', common_name: 'Rosemary', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 40, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Fragrant Mediterranean herb preferring dry conditions.' },
  { name: 'Thymus vulgaris', common_name: 'Thyme', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Aromatic herb with tiny leaves, drought tolerant.' },
  { name: 'Lavandula angustifolia', common_name: 'Lavender', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 10, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 35, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Fragrant purple flowers, Mediterranean origins.' },
  { name: 'Petroselinum crispum', common_name: 'Parsley', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 25, ideal_humidity: 55, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Classic garnish herb, biennial growth habit.' },
  { name: 'Coriandrum sativum', common_name: 'Cilantro', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 2, ideal_temperature_min: 10, ideal_temperature_max: 24, ideal_humidity: 50, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Fast-growing herb prone to bolting in heat.' },
  { name: 'Allium schoenoprasum', common_name: 'Chives', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 25, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Onion-flavored herb with edible flowers.' },

  // ORCHIDS
  { name: 'Phalaenopsis amabilis', common_name: 'Moth Orchid', category: 'Orchid', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Most popular orchid with long-lasting blooms.' },
  { name: 'Cattleya labiata', common_name: 'Corsage Orchid', category: 'Orchid', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Weekly in growing season', care_difficulty: 'Hard', description: 'Fragrant large-flowered orchid with pseudobulbs.' },
  { name: 'Dendrobium nobile', common_name: 'Noble Orchid', category: 'Orchid', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Weekly in growing season', care_difficulty: 'Hard', description: 'Cane-type orchid with fragrant clusters of flowers.' },
  { name: 'Oncidium sphacelatum', common_name: 'Dancing Lady Orchid', category: 'Orchid', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Sprays of small yellow and brown flowers.' },

  // AIR PLANTS (TILLANDSIA)
  { name: 'Tillandsia ionantha', common_name: 'Sky Plant', category: 'Air Plant', ideal_light: 'High', ideal_water_frequency: 4, ideal_temperature_min: 15, ideal_temperature_max: 32, ideal_humidity: 50, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Small air plant that blushes red before blooming.' },
  { name: 'Tillandsia xerographica', common_name: 'Queen Air Plant', category: 'Air Plant', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 35, ideal_humidity: 45, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Large silvery air plant with curling leaves.' },
  { name: 'Tillandsia usneoides', common_name: 'Spanish Moss', category: 'Air Plant', ideal_light: 'Medium', ideal_water_frequency: 3, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Cascading gray-green moss-like tillandsia.' },
  { name: 'Tillandsia caput-medusae', common_name: 'Medusa Air Plant', category: 'Air Plant', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 32, ideal_humidity: 50, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Twisted silver-green leaves like Medusa\'s hair.' },

  // CALATHEAS & MARANTHAS
  { name: 'Calathea ornata', common_name: 'Pinstripe Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Dark leaves with pink stripes, prayer plant behavior.' },
  { name: 'Calathea medallion', common_name: 'Medallion Calathea', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Large patterned leaves with purple undersides.' },
  { name: 'Maranta leuconeura', common_name: 'Prayer Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Leaves fold up like hands in prayer at night.' },
  { name: 'Stromanthe triostar', common_name: 'Triostar Stromanthe', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Hard', description: 'Multicolored leaves of green, cream, and pink.' },
  { name: 'Ctenanthe lubbersiana', common_name: 'Never Never Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 27, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Yellow-green variegated leaves with intricate patterns.' },

  // BEGONIAS
  { name: 'Begonia masoniana', common_name: 'Iron Cross Begonia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Puckered leaves with bold iron cross pattern.' },
  { name: 'Begonia rex', common_name: 'Rex Begonia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Spectacular patterned foliage in metallic hues.' },
  { name: 'Begonia boliviensis', common_name: 'Bolivian Begonia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 26, ideal_humidity: 55, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Pendulous flowers in red, orange or pink.' },

  // BROMELIADS
  { name: 'Guzmania lingulata', common_name: 'Scarlet Star', category: 'Bromeliad', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Glossy rosette with brilliant red flower spike.' },
  { name: 'Aechmea fasciata', common_name: 'Urn Plant', category: 'Bromeliad', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 27, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Silver-banded leaves cup around pink flower spike.' },
  { name: 'Vriesia splendens', common_name: 'Flaming Sword', category: 'Bromeliad', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Flat sword-like red flower between banded leaves.' },
  { name: 'Neoregelia carolinae', common_name: 'Blushing Bromeliad', category: 'Bromeliad', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Center turns vibrant red when plant is about to bloom.' },

  // AROIDS
  { name: 'Alocasia amazonica', common_name: 'African Mask', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Bold arrow-shaped leaves with contrasting veins.' },
  { name: 'Alocasia zebrina', common_name: 'Zebra Alocasia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Striking zebra-patterned petioles.' },
  { name: 'Colocasia esculenta', common_name: 'Taro', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 75, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Large heart-shaped leaves, edible tubers.' },
  { name: 'Anthurium andraeanum', common_name: 'Flamingo Flower', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Waxy heart-shaped spathes, long-lasting blooms.' },
  { name: 'Anthurium clarinervium', common_name: 'Velvet Cardboard Anthurium', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Hard', description: 'Heart-shaped leaves with silver vein patterns.' },
  { name: 'Syngonium podophyllum', common_name: 'Arrowhead Vine', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Arrow-shaped leaves that mature into lobed forms.' },
  { name: 'Caladium bicolor', common_name: 'Angel Wings', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Spectacular colorful paper-thin leaves.' },
  { name: 'Dieffenbachia seguine', common_name: 'Dumb Cane', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Large creamy-variegated leaves, toxic sap.' },

  // VINES & CLIMBERS
  { name: 'Hoya carnosa', common_name: 'Wax Plant', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Waxy leaves and fragrant star-shaped flower clusters.' },
  { name: 'Hoya kerrii', common_name: 'Sweetheart Hoya', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Heart-shaped succulent-like leaves.' },
  { name: 'Scindapsus pictus', common_name: 'Satin Pothos', category: 'Vine', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 29, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Matte green leaves with silver spots and splashes.' },
  { name: 'Ceropegia woodii', common_name: 'String of Hearts', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 40, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Trailing vine with heart-shaped succulent leaves.' },
  { name: 'Senecio rowleyanus', common_name: 'String of Pearls', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 40, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Trailing succulent with pea-shaped leaves.' },
  { name: 'Tradescantia zebrina', common_name: 'Inch Plant', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Striped purple and silver trailing foliage.' },
  { name: 'Epipremnum aureum', common_name: 'Marble Queen Pothos', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Heavily marbled white and green foliage.' },
  { name: 'Dischidia nummularia', common_name: 'String of Nickels', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Small round leaves strung along thin stems.' },

  // CHINESE EVERGREEN
  { name: 'Aglaonema commutatum', common_name: 'Chinese Evergreen', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Patterned leaves in shades of green and silver.' },
  { name: 'Aglaonema rotundum', common_name: 'Red Aglaonema', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Dark green leaves with vivid red markings.' },

  // RUBBER PLANTS & FICUS
  { name: 'Ficus elastica', common_name: 'Rubber Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Easy', description: 'Large glossy leaves on a sturdy trunk.' },
  { name: 'Ficus benjamina', common_name: 'Weeping Fig', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Graceful arching branches with small glossy leaves.' },
  { name: 'Ficus lyrata', common_name: 'Fiddle Leaf Fig', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Hard', description: 'Sculptural large fiddle-shaped leaves.' },
  { name: 'Ficus pumila', common_name: 'Creeping Fig', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 25, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Tiny heart-shaped leaves on self-clinging vine.' },
  { name: 'Ficus microcarpa', common_name: 'Indian Laurel', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Popular bonsai subject with glossy leaves.' },

  // CROTON
  { name: 'Codiaeum variegatum', common_name: 'Croton', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Spectacular multicolored leaves in red, orange, yellow.' },

  // PEPEROMIAS
  { name: 'Peperomia obtusifolia', common_name: 'Baby Rubber Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Glossy, thick cupped leaves on upright stems.' },
  { name: 'Peperomia caperata', common_name: 'Ripple Peperomia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Deeply ridged heart-shaped leaves.' },
  { name: 'Peperomia argyreia', common_name: 'Watermelon Peperomia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Silver-striped leaves resembling watermelon rind.' },
  { name: 'Peperomia rotundifolia', common_name: 'Trailing Jade', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 10, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Trailing stems with tiny round succulent leaves.' },

  // BAMBOO
  { name: 'Bambusoideae', common_name: 'Lucky Bamboo', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Architectural stems grown in water or soil.' },
  { name: 'Phyllostachys aurea', common_name: 'Golden Bamboo', category: 'Grass', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: -10, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Golden cane bamboo, can be invasive.' },

  // AQUATIC & BOG
  { name: 'Nymphaea odorata', common_name: 'Water Lily', category: 'Aquatic', ideal_light: 'High', ideal_water_frequency: 1, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 90, fertilizer_schedule: 'Monthly aquatic fertilizer', care_difficulty: 'Moderate', description: 'Classic floating pond plant with fragrant flowers.' },
  { name: 'Pistia stratiotes', common_name: 'Water Lettuce', category: 'Aquatic', ideal_light: 'High', ideal_water_frequency: 1, ideal_temperature_min: 20, ideal_temperature_max: 32, ideal_humidity: 90, fertilizer_schedule: 'Monthly aquatic fertilizer', care_difficulty: 'Easy', description: 'Floating rosette with velvety textured leaves.' },

  // FLOWERING PLANTS
  { name: 'Cyclamen persicum', common_name: 'Florist\'s Cyclamen', category: 'Flowering', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 18, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Swept-back flowers in pink, red, white.' },
  { name: 'Kalanchoe blossfeldiana', common_name: 'Flaming Katy', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 10, ideal_temperature_min: 15, ideal_temperature_max: 26, ideal_humidity: 40, fertilizer_schedule: 'Monthly when flowering', care_difficulty: 'Easy', description: 'Clusters of tiny bright flowers above succulent leaves.' },
  { name: 'Schlumbergera bridgesii', common_name: 'Christmas Cactus', category: 'Cactus', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 24, ideal_humidity: 55, fertilizer_schedule: 'Monthly when growing', care_difficulty: 'Easy', description: 'Segmented stems with flowers in winter.' },
  { name: 'Hippeastrum vittatum', common_name: 'Amaryllis', category: 'Bulb', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 50, fertilizer_schedule: 'Every 2 weeks when growing', care_difficulty: 'Easy', description: 'Bold trumpet-shaped flowers on tall stems.' },
  { name: 'Gardenia jasminoides', common_name: 'Gardenia', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Intensely fragrant white flowers, demanding care.' },
  { name: 'Ixora coccinea', common_name: 'Jungle Flame', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Clusters of tiny red, orange, yellow flowers.' },

  // FICUS VARIETIES
  { name: 'Ficus triangularis', common_name: 'Triangle Ficus', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 27, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Triangular-shaped glossy leaves.' },

  // CLIMBING PLANTS
  { name: 'Monstera adansonii', common_name: 'Swiss Cheese Vine', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Smaller monstera with elegantly perforated leaves.' },
  { name: 'Monstera obliqua', common_name: 'Monstera Obliqua', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Rare monstera with dramatically fenestrated leaves.' },
  { name: 'Rhaphidophora tetrasperma', common_name: 'Mini Monstera', category: 'Vine', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Fast-growing climber with split mini leaves.' },

  // PALMS (ADDITIONAL)
  { name: 'Livistona chinensis', common_name: 'Chinese Fan Palm', category: 'Palm', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Fan-shaped leaves with drooping tips.' },
  { name: 'Trachycarpus fortunei', common_name: 'Windmill Palm', category: 'Palm', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: -10, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Cold-hardy palm with fiber-covered trunk.' },

  // STRELITZIA
  { name: 'Strelitzia reginae', common_name: 'Bird of Paradise', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Stunning orange and blue crane-like flowers.' },
  { name: 'Strelitzia nicolai', common_name: 'White Bird of Paradise', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Moderate', description: 'Giant banana-like leaves, great statement plant.' },

  // COFFEE PLANT
  { name: 'Coffea arabica', common_name: 'Coffee Plant', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Glossy leaves; produces coffee beans indoors.' },

  // YUCCA & AGAVE
  { name: 'Yucca elephantipes', common_name: 'Spineless Yucca', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 32, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Bold architectural plant with sword-like leaves.' },
  { name: 'Agave americana', common_name: 'Century Plant', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 21, ideal_temperature_min: 10, ideal_temperature_max: 38, ideal_humidity: 30, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Dramatic spiky rosette; blooms once then dies.' },
  { name: 'Agave attenuata', common_name: 'Soft Agave', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 35, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Spineless agave with a soft rosette form.' },

  // BROMELIADS (ADDITIONAL)
  { name: 'Tillandsia cyanea', common_name: 'Pink Quill', category: 'Bromeliad', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Pink paddle-shaped flower spike with purple blooms.' },
  { name: 'Cryptanthus bivittatus', common_name: 'Earth Star', category: 'Bromeliad', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Star-shaped rosette with striped leaves.' },

  // CARNIVOROUS
  { name: 'Dionaea muscipula', common_name: 'Venus Flytrap', category: 'Carnivorous', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 75, fertilizer_schedule: 'Never fertilize', care_difficulty: 'Hard', description: 'Iconic snap traps catch insects for nutrition.' },
  { name: 'Nepenthes alata', common_name: 'Tropical Pitcher Plant', category: 'Carnivorous', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 80, fertilizer_schedule: 'Never fertilize (uses insects)', care_difficulty: 'Hard', description: 'Elaborate hanging pitchers trap and digest insects.' },
  { name: 'Sarracenia purpurea', common_name: 'Purple Pitcher Plant', category: 'Carnivorous', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 5, ideal_temperature_max: 28, ideal_humidity: 75, fertilizer_schedule: 'Never fertilize', care_difficulty: 'Hard', description: 'Purple pitchers trap insects in rainwater.' },
  { name: 'Drosera capensis', common_name: 'Cape Sundew', category: 'Carnivorous', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 75, fertilizer_schedule: 'Never fertilize', care_difficulty: 'Moderate', description: 'Sticky tentacle leaves trap small insects.' },
  { name: 'Pinguicula grandiflora', common_name: 'Butterwort', category: 'Carnivorous', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 5, ideal_temperature_max: 24, ideal_humidity: 70, fertilizer_schedule: 'Never fertilize', care_difficulty: 'Moderate', description: 'Flat rosette leaves catch gnats and fungus flies.' },

  // PILEA
  { name: 'Pilea peperomioides', common_name: 'Chinese Money Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Round coin-shaped leaves on long petioles.' },
  { name: 'Pilea cadierei', common_name: 'Aluminum Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Silver and green metallic patterned leaves.' },
  { name: 'Pilea involucrata', common_name: 'Friendship Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Deeply textured bronze-green leaves.' },

  // SPIDER PLANTS
  { name: 'Chlorophytum comosum', common_name: 'Spider Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Arching variegated leaves, prolific offshoots.' },
  { name: 'Chlorophytum orchidastrum', common_name: 'Green Orange Spider Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Broader leaves with orange stems and midrib.' },

  // ASPARAGUS FERN
  { name: 'Asparagus setaceus', common_name: 'Asparagus Fern', category: 'Fern', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Feathery cloud-like foliage, not a true fern.' },
  { name: 'Asparagus densiflorus', common_name: 'Foxtail Fern', category: 'Fern', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Fluffy arching frond-like stems.' },

  // SELAGINELLA
  { name: 'Selaginella martensii', common_name: 'Spike Moss', category: 'Fern', ideal_light: 'Low', ideal_water_frequency: 3, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 80, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Delicate moss-like plant with iridescent blue-green foliage.' },

  // GINGER FAMILY
  { name: 'Zingiber officinale', common_name: 'Ginger', category: 'Herb', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Tropical rhizome with edible roots and ornamental leaves.' },
  { name: 'Curcuma longa', common_name: 'Turmeric', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 20, ideal_temperature_max: 30, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Rhizome plant with golden-yellow edible roots.' },

  // BEGONIA (ADDITIONAL)
  { name: 'Begonia tamaya', common_name: 'Angel Wing Begonia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Spotted wing-shaped leaves with cascading flowers.' },

  // DAISIES & CHRYSANTHEMUMS
  { name: 'Chrysanthemum morifolium', common_name: 'Chrysanthemum', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 22, ideal_humidity: 55, fertilizer_schedule: 'Every 2 weeks when growing', care_difficulty: 'Moderate', description: 'Dense clusters of daisy-like flowers, many colors.' },
  { name: 'Gerbera jamesonii', common_name: 'Gerbera Daisy', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 55, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Large cheerful blooms in vivid colors.' },
  { name: 'Saintpaulia ionantha', common_name: 'African Violet', category: 'Flowering', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Compact rosette with delicate fuzzy flowers.' },

  // OXALIS
  { name: 'Oxalis triangularis', common_name: 'Purple Shamrock', category: 'Bulb', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 26, ideal_humidity: 50, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Triangular deep purple leaves fold up at night.' },

  // GERANIUMS
  { name: 'Pelargonium graveolens', common_name: 'Rose Geranium', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 26, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Rose-scented leaves used in perfumery and cooking.' },
  { name: 'Pelargonium zonale', common_name: 'Zonal Geranium', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 10, ideal_temperature_max: 26, ideal_humidity: 45, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Round-headed flower clusters in red, pink, or white.' },

  // CITRUS
  { name: 'Citrus limon', common_name: 'Lemon Tree', category: 'Fruit', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Fragrant flowers, edible lemons, great container plant.' },
  { name: 'Citrus sinensis', common_name: 'Sweet Orange', category: 'Fruit', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 16, ideal_temperature_max: 30, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Sweet oranges in container; needs full sun.' },
  { name: 'Kumquat fortunella', common_name: 'Kumquat', category: 'Fruit', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Small round fruits eaten whole, sweet rind, sour flesh.' },

  // MOSSES
  { name: 'Taxiphyllum barbieri', common_name: 'Java Moss', category: 'Moss', ideal_light: 'Low', ideal_water_frequency: 1, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 95, fertilizer_schedule: 'Monthly liquid fertilizer', care_difficulty: 'Easy', description: 'Aquatic moss used in terrariums and aquariums.' },

  // TROPICALS (MORE)
  { name: 'Schefflera arboricola', common_name: 'Dwarf Umbrella Tree', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Glossy finger-like leaflets radiating like an umbrella.' },
  { name: 'Schefflera actinophylla', common_name: 'Umbrella Tree', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Large tropical with dramatic canopy.' },
  { name: 'Pachira aquatica', common_name: 'Money Tree', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Braided trunk with palmate glossy leaves.' },
  { name: 'Fatsia japonica', common_name: 'Japanese Aralia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 10, ideal_temperature_max: 24, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Bold large-lobed leaves, tolerates cool rooms.' },
  { name: 'Araucaria heterophylla', common_name: 'Norfolk Island Pine', category: 'Conifer', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 24, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Tiered branch structure; a living Christmas tree.' },
  { name: 'Polyscias fruticosa', common_name: 'Ming Aralia', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Hard', description: 'Feathery finely-cut foliage on woody stems.' },
  { name: 'Pseudopanax lessonii', common_name: 'Houpara', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 10, ideal_temperature_max: 26, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Leathery palmate leaves; coastal New Zealand native.' },
  { name: 'Soleirolia soleirolii', common_name: 'Baby\'s Tears', category: 'Groundcover', ideal_light: 'Low', ideal_water_frequency: 3, ideal_temperature_min: 10, ideal_temperature_max: 24, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Carpet of tiny rounded leaves on delicate stems.' },

  // FICUS (MORE)
  { name: 'Ficus religiosa', common_name: 'Sacred Fig / Bodhi Tree', category: 'Tropical', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 20, ideal_temperature_max: 32, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Heart-shaped leaves with distinctive long drip tips.' },

  // ALOES (ADDITIONAL)
  { name: 'Aloe ferox', common_name: 'Cape Aloe', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 32, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Large spiny aloe with bright orange-red flower spikes.' },
  { name: 'Aloe arborescens', common_name: 'Candelabra Aloe', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 30, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Multi-branched aloe with red winter flowers.' },

  // CYCADS
  { name: 'Cycas revoluta', common_name: 'Sago Palm', category: 'Cycad', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Ancient plant with feathery arching leaves and crown.' },

  // TILLANDSIA (MORE)
  { name: 'Tillandsia bulbosa', common_name: 'Bulbous Air Plant', category: 'Air Plant', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 32, ideal_humidity: 55, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Swollen bulbous base with octopus-like tendrils.' },
  { name: 'Tillandsia stricta', common_name: 'Upright Air Plant', category: 'Air Plant', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 50, fertilizer_schedule: 'Monthly foliar spray', care_difficulty: 'Easy', description: 'Upright rosette that blooms with pink bracts.' },

  // ANTHURIUMS (MORE)
  { name: 'Anthurium veitchii', common_name: 'King Anthurium', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 75, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Enormous corrugated glossy leaves hanging downward.' },
  { name: 'Anthurium warocqueanum', common_name: 'Queen Anthurium', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 75, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Velvety elongated leaves with silver veining.' },

  // CALATHEA (MORE)
  { name: 'Calathea zebrina', common_name: 'Zebra Plant Calathea', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Velvety leaves with bold dark green zebra stripes.' },
  { name: 'Calathea warscewiczii', common_name: 'Velvet Calathea', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Hard', description: 'Velvety deep green with lighter feathered pattern.' },
  { name: 'Calathea lancifolia', common_name: 'Rattlesnake Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 70, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Long wavy leaves with alternating dark spots.' },

  // SUCCULENTS (MORE)
  { name: 'Gasteria bicolor', common_name: 'Ox Tongue Plant', category: 'Succulent', ideal_light: 'Medium', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 40, fertilizer_schedule: 'Monthly in spring/summer', care_difficulty: 'Easy', description: 'Tongue-shaped warty leaves in stacked pairs.' },
  { name: 'Sempervivum tectorum', common_name: 'Hens and Chicks', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: -20, ideal_temperature_max: 30, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Cold-hardy rosette that spreads by small offsets.' },
  { name: 'Lithops lesliei', common_name: 'Living Stones', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 30, ideal_temperature_min: 10, ideal_temperature_max: 35, ideal_humidity: 25, fertilizer_schedule: 'Never (naturally absorbs nutrients)', care_difficulty: 'Hard', description: 'Remarkable mimicry plants resembling small stones.' },
  { name: 'Graptoveria amethorum', common_name: 'Porcelain Plant', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 30, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Plump jewel-like rosette with pink leaf tips.' },
  { name: 'Pachyphytum oviferum', common_name: 'Moonstones', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 35, fertilizer_schedule: 'Once in spring', care_difficulty: 'Easy', description: 'Chubby egg-shaped leaves in pastel lavender-pink.' },
  { name: 'Dudleya brittonii', common_name: 'Chalk Liveforever', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 5, ideal_temperature_max: 28, ideal_humidity: 30, fertilizer_schedule: 'Once in spring', care_difficulty: 'Moderate', description: 'Elegant chalk-white powdery rosette.' },
  { name: 'Portulacaria afra', common_name: 'Elephant Bush', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 32, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Miniature tree-like succulent with tiny round leaves.' },

  // ORCHIDS (MORE)
  { name: 'Epidendrum ibaguense', common_name: 'Crucifix Orchid', category: 'Orchid', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 65, fertilizer_schedule: 'Weekly in growing season', care_difficulty: 'Moderate', description: 'Compact clusters of vibrant red-orange flowers.' },
  { name: 'Zygopetalum mackaii', common_name: 'Zygopetalum Orchid', category: 'Orchid', ideal_light: 'Medium', ideal_water_frequency: 7, ideal_temperature_min: 15, ideal_temperature_max: 25, ideal_humidity: 65, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Moderate', description: 'Intensely fragrant waxy flowers in blue-purple.' },

  // IVY & GROUND COVERS
  { name: 'Hedera helix', common_name: 'English Ivy', category: 'Vine', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 5, ideal_temperature_max: 22, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Classic lobed leaves; great hanging basket plant.' },
  { name: 'Hedera canariensis', common_name: 'Canary Island Ivy', category: 'Vine', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 24, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Larger ivy with glossy green and cream variegation.' },
  { name: 'Lamium maculatum', common_name: 'Spotted Dead Nettle', category: 'Groundcover', ideal_light: 'Low', ideal_water_frequency: 5, ideal_temperature_min: 5, ideal_temperature_max: 22, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Silver-splashed leaves, tolerates deep shade.' },

  // COLEUS
  { name: 'Plectranthus scutellarioides', common_name: 'Coleus', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 3, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Spectacular multicolored foliage in countless varieties.' },

  // IMPATIENS
  { name: 'Impatiens walleriana', common_name: 'Busy Lizzie', category: 'Flowering', ideal_light: 'Low', ideal_water_frequency: 2, ideal_temperature_min: 16, ideal_temperature_max: 26, ideal_humidity: 60, fertilizer_schedule: 'Weekly in growing season', care_difficulty: 'Easy', description: 'Prolific bloomer for shade with jewel-toned flowers.' },

  // NERVE PLANT
  { name: 'Fittonia albivenis', common_name: 'Nerve Plant', category: 'Tropical', ideal_light: 'Low', ideal_water_frequency: 3, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 80, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Intricately veined leaves in green, white or pink.' },

  // DAISIES
  { name: 'Osteospermum ecklonis', common_name: 'Cape Daisy', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 26, ideal_humidity: 50, fertilizer_schedule: 'Every 2 weeks in growing season', care_difficulty: 'Easy', description: 'Cheerful daisy-like flowers in white, purple, orange.' },

  // WISTERIA & VINES
  { name: 'Passiflora caerulea', common_name: 'Passion Flower', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 10, ideal_temperature_max: 28, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Exotic, complex flowers in blue-white-purple.' },

  // CITRONELLA / MOSQUITO
  { name: 'Pelargonium citrosum', common_name: 'Citronella Plant', category: 'Herb', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 15, ideal_temperature_max: 28, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Lemon-scented geranium said to repel mosquitoes.' },

  // MORE TROPICAL
  { name: 'Cordyline fruticosa', common_name: 'Ti Plant', category: 'Tropical', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Colorful sword-like leaves in red, pink, green varieties.' },
  { name: 'Beaucarnea recurvata', common_name: 'Ponytail Palm', category: 'Succulent', ideal_light: 'High', ideal_water_frequency: 21, ideal_temperature_min: 15, ideal_temperature_max: 35, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Swollen trunk base with cascading curly green leaves.' },
  { name: 'Pilea nummulariifolia', common_name: 'Creeping Charlie', category: 'Groundcover', ideal_light: 'Medium', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 28, ideal_humidity: 60, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Easy', description: 'Compact mat-forming plant with textured round leaves.' },
  { name: 'Xerosicyos danguyi', common_name: 'Silver Dollar Plant', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 14, ideal_temperature_min: 15, ideal_temperature_max: 30, ideal_humidity: 35, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Succulent vine with round flat gray-green leaves.' },
  { name: 'Stephanotis floribunda', common_name: 'Madagascar Jasmine', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 26, ideal_humidity: 65, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Hard', description: 'Waxy, intensely fragrant white flowers.' },
  { name: 'Plumeria rubra', common_name: 'Frangipani', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 20, ideal_temperature_max: 32, ideal_humidity: 55, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Tropical tree with intensely fragrant flowers.' },
  { name: 'Hibiscus rosa-sinensis', common_name: 'Chinese Hibiscus', category: 'Flowering', ideal_light: 'High', ideal_water_frequency: 5, ideal_temperature_min: 18, ideal_temperature_max: 30, ideal_humidity: 60, fertilizer_schedule: 'Weekly in growing season', care_difficulty: 'Moderate', description: 'Large showy flowers in vibrant tropical colors.' },
  { name: 'Bougainvillea spectabilis', common_name: 'Bougainvillea', category: 'Vine', ideal_light: 'High', ideal_water_frequency: 7, ideal_temperature_min: 18, ideal_temperature_max: 32, ideal_humidity: 45, fertilizer_schedule: 'Monthly in growing season', care_difficulty: 'Moderate', description: 'Vivid papery bracts in magenta, orange, and white.' }
];

async function seed() {
  let conn;
  try {
    // Connect without database first
    conn = await mysql.createConnection(dbConfig);
    console.log('📦 Connected to MySQL');

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS plants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        common_name VARCHAR(100),
        category VARCHAR(50),
        ideal_light ENUM('Low', 'Medium', 'High') NOT NULL,
        ideal_water_frequency INT NOT NULL,
        ideal_temperature_min DECIMAL(4,1) NOT NULL,
        ideal_temperature_max DECIMAL(4,1) NOT NULL,
        ideal_humidity INT NOT NULL,
        fertilizer_schedule VARCHAR(100) NOT NULL,
        care_difficulty ENUM('Easy', 'Moderate', 'Hard') DEFAULT 'Moderate',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS user_plants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        plant_id INT NOT NULL,
        light ENUM('Low', 'Medium', 'High') NOT NULL,
        temperature DECIMAL(4,1) NOT NULL,
        humidity INT NOT NULL,
        watering_habit INT NOT NULL,
        health_score INT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Tables created');

    // Seed plants
    let inserted = 0;
    let skipped = 0;

    for (const plant of plants) {
      try {
        await conn.execute(
          `INSERT IGNORE INTO plants
            (name, common_name, category, ideal_light, ideal_water_frequency,
             ideal_temperature_min, ideal_temperature_max, ideal_humidity,
             fertilizer_schedule, care_difficulty, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            plant.name, plant.common_name, plant.category,
            plant.ideal_light, plant.ideal_water_frequency,
            plant.ideal_temperature_min, plant.ideal_temperature_max,
            plant.ideal_humidity, plant.fertilizer_schedule,
            plant.care_difficulty, plant.description
          ]
        );
        inserted++;
      } catch (e) {
        skipped++;
      }
    }

    console.log(`🌱 Seeded ${inserted} plants (${skipped} skipped/duplicate)`);
    console.log('✅ Database setup complete!');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

seed();
