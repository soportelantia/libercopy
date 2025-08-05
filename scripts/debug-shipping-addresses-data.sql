-- Verificar datos en order_shipping_addresses
SELECT 
  osa.id,
  osa.order_id,
  osa.recipient_name,
  osa.company,
  osa.address_line_1,
  osa.address_line_2,
  osa.city,
  osa.postal_code,
  osa.province,
  osa.country,
  osa.phone,
  osa.email,
  osa.delivery_notes,
  osa.shipping_type,
  o.id as order_exists,
  o.status as order_status
FROM order_shipping_addresses osa
LEFT JOIN orders o ON osa.order_id = o.id
ORDER BY osa.created_at DESC
LIMIT 10;
