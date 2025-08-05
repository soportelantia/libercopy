-- Verificar direcciones de envío
SELECT 
  osa.order_id,
  osa.recipient_name,
  osa.address_line_1,
  osa.city,
  osa.postal_code,
  o.id as order_exists
FROM order_shipping_addresses osa
RIGHT JOIN orders o ON osa.order_id = o.id
ORDER BY o.created_at DESC
LIMIT 10;
