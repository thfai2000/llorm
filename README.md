






Concept:




Example of relation data in one row:
```
  CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NULL,
  `shopId` integer
  );
  CREATE TABLE `shop` (
  `id` bigint NOT NULL AUTO_INCREMENT PRIMARY KEY
  );

  truncate table product;
  truncate table shop;

  insert into shop (id) values (null), (null), (null);
  insert into product (name, shopId) values 
  ('a', 1), ('b', 1), ('c',1),
  ('d', 2), ('e', 2), ('f',2);

  select * from shop;
  select * from product;

  SELECT id, (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', name))
    FROM
    (
    SELECT * from product WHERE product.id = shop.id
    ) AS t
  ) AS `products` FROM shop;
```

