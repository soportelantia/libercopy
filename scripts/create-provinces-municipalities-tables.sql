-- Crear tabla de provincias si no existe
CREATE TABLE IF NOT EXISTS provinces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Crear tabla de municipios si no existe
CREATE TABLE IF NOT EXISTS municipalities (
    id TEXT PRIMARY KEY,
    province_id TEXT NOT NULL REFERENCES provinces(id),
    name TEXT NOT NULL
);

-- Habilitar RLS
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir lectura pública
CREATE POLICY "Allow public read access on provinces" ON provinces
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on municipalities" ON municipalities
    FOR SELECT USING (true);

-- Insertar datos de provincias españolas si no existen
INSERT INTO provinces (id, name) VALUES 
    ('01', 'Álava'),
    ('02', 'Albacete'),
    ('03', 'Alicante'),
    ('04', 'Almería'),
    ('05', 'Ávila'),
    ('06', 'Badajoz'),
    ('07', 'Baleares'),
    ('08', 'Barcelona'),
    ('09', 'Burgos'),
    ('10', 'Cáceres'),
    ('11', 'Cádiz'),
    ('12', 'Castellón'),
    ('13', 'Ciudad Real'),
    ('14', 'Córdoba'),
    ('15', 'A Coruña'),
    ('16', 'Cuenca'),
    ('17', 'Girona'),
    ('18', 'Granada'),
    ('19', 'Guadalajara'),
    ('20', 'Guipúzcoa'),
    ('21', 'Huelva'),
    ('22', 'Huesca'),
    ('23', 'Jaén'),
    ('24', 'León'),
    ('25', 'Lleida'),
    ('26', 'La Rioja'),
    ('27', 'Lugo'),
    ('28', 'Madrid'),
    ('29', 'Málaga'),
    ('30', 'Murcia'),
    ('31', 'Navarra'),
    ('32', 'Ourense'),
    ('33', 'Asturias'),
    ('34', 'Palencia'),
    ('35', 'Las Palmas'),
    ('36', 'Pontevedra'),
    ('37', 'Salamanca'),
    ('38', 'Santa Cruz de Tenerife'),
    ('39', 'Cantabria'),
    ('40', 'Segovia'),
    ('41', 'Sevilla'),
    ('42', 'Soria'),
    ('43', 'Tarragona'),
    ('44', 'Teruel'),
    ('45', 'Toledo'),
    ('46', 'Valencia'),
    ('47', 'Valladolid'),
    ('48', 'Vizcaya'),
    ('49', 'Zamora'),
    ('50', 'Zaragoza'),
    ('51', 'Ceuta'),
    ('52', 'Melilla')
ON CONFLICT (id) DO NOTHING;

-- Insertar algunos municipios de ejemplo
INSERT INTO municipalities (id, province_id, name) VALUES 
    ('28001', '28', 'Madrid'),
    ('28002', '28', 'Alcalá de Henares'),
    ('28003', '28', 'Alcobendas'),
    ('08001', '08', 'Barcelona'),
    ('08002', '08', 'Badalona'),
    ('08003', '08', 'Hospitalet de Llobregat'),
    ('46001', '46', 'Valencia'),
    ('46002', '46', 'Gandía'),
    ('46003', '46', 'Sagunto'),
    ('41001', '41', 'Sevilla'),
    ('41002', '41', 'Dos Hermanas'),
    ('41003', '41', 'Alcalá de Guadaíra')
ON CONFLICT (id) DO NOTHING;
