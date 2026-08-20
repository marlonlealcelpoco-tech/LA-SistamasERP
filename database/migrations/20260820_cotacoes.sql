CREATE TABLE quotation_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotation_products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  category_id BIGINT REFERENCES quotation_categories(id) ON DELETE SET NULL,
  sale_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  units_per_box INTEGER NOT NULL DEFAULT 1 CHECK (units_per_box > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotation_suppliers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  contact VARCHAR(180),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotations (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES quotation_products(id) ON DELETE CASCADE,
  supplier_id BIGINT NOT NULL REFERENCES quotation_suppliers(id) ON DELETE CASCADE,
  price_type VARCHAR(3) NOT NULL CHECK (price_type IN ('un','cx')),
  value DECIMAL(15,2) NOT NULL CHECK (value >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotation_products_category ON quotation_products(category_id);
CREATE INDEX idx_quotation_products_name ON quotation_products(name);
CREATE INDEX idx_quotation_suppliers_name ON quotation_suppliers(name);
CREATE INDEX idx_quotations_product ON quotations(product_id);
CREATE INDEX idx_quotations_supplier ON quotations(supplier_id);
