-- Insertar categorías del blog
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Impresión', 'impresion', 'Todo sobre técnicas y consejos de impresión', '#3B82F6'),
('Encuadernación', 'encuadernacion', 'Guías y tutoriales sobre encuadernación', '#10B981'),
('Diseño', 'diseno', 'Tips de diseño para documentos y presentaciones', '#F59E0B'),
('Tecnología', 'tecnologia', 'Últimas tendencias en tecnología de impresión', '#8B5CF6'),
('Consejos', 'consejos', 'Consejos útiles para estudiantes y profesionales', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- Insertar tags del blog
INSERT INTO blog_tags (name, slug) VALUES
('PDF', 'pdf'),
('Calidad', 'calidad'),
('Ahorro', 'ahorro'),
('Estudiantes', 'estudiantes'),
('Profesional', 'profesional'),
('Color', 'color'),
('Blanco y Negro', 'blanco-y-negro'),
('Papel', 'papel'),
('Formato', 'formato'),
('Presentaciones', 'presentaciones')
ON CONFLICT (slug) DO NOTHING;

-- Insertar posts del blog
INSERT INTO blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  featured_image,
  category_id,
  status,
  published_at,
  reading_time,
  meta_title,
  meta_description
) VALUES
(
  'Cómo optimizar tus documentos PDF para impresión',
  'como-optimizar-documentos-pdf-impresion',
  'Aprende a preparar tus archivos PDF para obtener la mejor calidad de impresión y ahorrar en costes.',
  '<h2>Introducción</h2><p>La optimización de documentos PDF es crucial para obtener impresiones de alta calidad. En esta guía te enseñamos los mejores consejos.</p><h2>Configuración de calidad</h2><p>Para documentos de texto, una resolución de 300 DPI es suficiente. Para imágenes, considera usar 600 DPI.</p><h2>Formato y márgenes</h2><p>Asegúrate de configurar correctamente los márgenes y el formato de página antes de generar el PDF.</p>',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM blog_categories WHERE slug = 'impresion'),
  'published',
  now() - interval '2 days',
  5,
  'Optimizar PDF para impresión - Guía completa',
  'Guía completa para optimizar documentos PDF y obtener la mejor calidad de impresión.'
),
(
  'Tipos de encuadernación: ¿cuál elegir?',
  'tipos-encuadernacion-cual-elegir',
  'Descubre los diferentes tipos de encuadernación disponibles y cuál es el mejor para tu proyecto.',
  '<h2>Encuadernación en espiral</h2><p>Ideal para documentos que necesitas abrir completamente, como manuales o cuadernos de trabajo.</p><h2>Encuadernación térmica</h2><p>Perfecta para documentos profesionales como informes o presentaciones importantes.</p><h2>Encuadernación con grapas</h2><p>La opción más económica para documentos de pocas páginas.</p>',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM blog_categories WHERE slug = 'encuadernacion'),
  'published',
  now() - interval '5 days',
  7,
  'Tipos de encuadernación - Guía de selección',
  'Conoce los diferentes tipos de encuadernación y elige el mejor para tu proyecto.'
),
(
  'Consejos de diseño para presentaciones impactantes',
  'consejos-diseno-presentaciones-impactantes',
  'Mejora tus presentaciones con estos consejos de diseño que harán que destaquen al imprimirlas.',
  '<h2>Uso del color</h2><p>Los colores vibrantes funcionan bien en pantalla, pero para impresión considera tonos más suaves.</p><h2>Tipografía legible</h2><p>Usa fuentes sans-serif para títulos y serif para texto largo. Tamaño mínimo de 12pt.</p><h2>Espaciado y composición</h2><p>Deja suficiente espacio en blanco para que el contenido respire.</p>',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM blog_categories WHERE slug = 'diseno'),
  'published',
  now() - interval '1 week',
  6,
  'Diseño de presentaciones para impresión',
  'Consejos profesionales para diseñar presentaciones que se vean perfectas impresas.'
),
(
  'Ahorra dinero en impresión: trucos que funcionan',
  'ahorra-dinero-impresion-trucos',
  'Descubre estrategias efectivas para reducir tus costes de impresión sin sacrificar calidad.',
  '<h2>Impresión a doble cara</h2><p>Reduce el uso de papel hasta un 50% imprimiendo por ambas caras.</p><h2>Modo borrador para borradores</h2><p>Usa calidad borrador para documentos internos y reserva alta calidad para documentos finales.</p><h2>Planifica tus impresiones</h2><p>Agrupa tus trabajos de impresión para aprovechar mejor los recursos.</p>',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM blog_categories WHERE slug = 'consejos'),
  'published',
  now() - interval '10 days',
  4,
  'Cómo ahorrar en impresión - Trucos efectivos',
  'Estrategias probadas para reducir costes de impresión manteniendo la calidad.'
),
(
  'Tendencias en tecnología de impresión 2024',
  'tendencias-tecnologia-impresion-2024',
  'Explora las últimas innovaciones en tecnología de impresión que están cambiando la industria.',
  '<h2>Impresión sostenible</h2><p>Las nuevas tecnologías se enfocan en reducir el impacto ambiental.</p><h2>Impresión bajo demanda</h2><p>La personalización y la impresión instantánea son el futuro.</p><h2>Integración digital</h2><p>La conexión entre dispositivos digitales e impresoras es cada vez más fluida.</p>',
  '/placeholder.svg?height=400&width=600',
  (SELECT id FROM blog_categories WHERE slug = 'tecnologia'),
  'published',
  now() - interval '3 days',
  8,
  'Tendencias impresión 2024 - Tecnología',
  'Descubre las últimas tendencias en tecnología de impresión para 2024.'
)
ON CONFLICT (slug) DO NOTHING;

-- Relacionar posts con tags
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT 
  bp.id,
  bt.id
FROM blog_posts bp, blog_tags bt
WHERE 
  (bp.slug = 'como-optimizar-documentos-pdf-impresion' AND bt.slug IN ('pdf', 'calidad', 'profesional')) OR
  (bp.slug = 'tipos-encuadernacion-cual-elegir' AND bt.slug IN ('profesional', 'presentaciones')) OR
  (bp.slug = 'consejos-diseno-presentaciones-impactantes' AND bt.slug IN ('color', 'presentaciones', 'profesional')) OR
  (bp.slug = 'ahorra-dinero-impresion-trucos' AND bt.slug IN ('ahorro', 'estudiantes', 'papel')) OR
  (bp.slug = 'tendencias-tecnologia-impresion-2024' AND bt.slug IN ('profesional', 'calidad'))
ON CONFLICT (post_id, tag_id) DO NOTHING;
