-- Agregar columna temp_path a order_items para rastrear archivos temporales
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS temp_path TEXT;

-- Comentario: Esta columna almacenará la ruta temporal del archivo antes de moverlo a la carpeta del pedido
