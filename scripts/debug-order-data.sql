-- Verificar datos de pedidos y sus elementos
SELECT 
  o.id as order_id,
  o.total_amount,
  o.status,
  o.created_at,
  oi.id as item_id,
  oi.file_name,
  oi.price,
  oi.copies,
  oi.page_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC
LIMIT 10;
