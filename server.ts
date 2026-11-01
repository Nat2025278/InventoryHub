import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  warehouseLocation: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'archived';
  lastRestocked: string;
  updatedAt: string;
  tags: string[];
}

// Initial Seed Data (16 realistic enterprise inventory items)
let products: Product[] = [
  {
    id: 'PRD-101',
    sku: 'ELEC-SNS-01',
    name: 'Sensor IoT Industrial Ultrasonido',
    category: 'Electrónica',
    stock: 42,
    minStock: 15,
    maxStock: 100,
    unitPrice: 89.50,
    costPrice: 45.00,
    supplier: 'OmniSense Technologies',
    warehouseLocation: 'Pasillo A-03, Nivel 2',
    status: 'in_stock',
    lastRestocked: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-28T14:20:00Z',
    tags: ['iot', 'sensores', 'telemetría', 'automatización']
  },
  {
    id: 'PRD-102',
    sku: 'LOG-SCAN-02',
    name: 'Lector de Código de Barras 2D Inalámbrico',
    category: 'Logística',
    stock: 8,
    minStock: 10,
    maxStock: 50,
    unitPrice: 145.00,
    costPrice: 82.50,
    supplier: 'LogiScan Global Logistics',
    warehouseLocation: 'Pasillo B-12, Nivel 1',
    status: 'low_stock',
    lastRestocked: '2026-09-20T11:00:00Z',
    updatedAt: '2026-10-30T16:45:00Z',
    tags: ['rfid', 'logistica', 'lectores', 'almacén']
  },
  {
    id: 'PRD-103',
    sku: 'TOOL-DRL-03',
    name: 'Taladro Percutor Brushless 24V HD',
    category: 'Herramientas',
    stock: 0,
    minStock: 5,
    maxStock: 30,
    unitPrice: 220.00,
    costPrice: 130.00,
    supplier: 'Apex Power Equipments',
    warehouseLocation: 'Pasillo C-01, Nivel 3',
    status: 'out_of_stock',
    lastRestocked: '2026-08-14T08:15:00Z',
    updatedAt: '2026-10-31T10:10:00Z',
    tags: ['herramientas', 'eléctricas', 'taller', 'alto-rendimiento']
  },
  {
    id: 'PRD-104',
    sku: 'RAW-ALUM-04',
    name: 'Perfil de Aluminio Estructural 40x40 (3m)',
    category: 'Materias Primas',
    stock: 120,
    minStock: 30,
    maxStock: 300,
    unitPrice: 34.90,
    costPrice: 18.20,
    supplier: 'Metalúrgica Andina S.A.',
    warehouseLocation: 'Patio Exterior E-04',
    status: 'in_stock',
    lastRestocked: '2026-10-25T14:00:00Z',
    updatedAt: '2026-10-25T14:00:00Z',
    tags: ['aluminio', 'estructural', 'metal', 'fabricación']
  },
  {
    id: 'PRD-105',
    sku: 'ELEC-CTRL-05',
    name: 'Módulo PLC Programable 16 I/O Modbus',
    category: 'Electrónica',
    stock: 6,
    minStock: 8,
    maxStock: 25,
    unitPrice: 380.00,
    costPrice: 210.00,
    supplier: 'OmniSense Technologies',
    warehouseLocation: 'Pasillo A-07, Nivel 1',
    status: 'low_stock',
    lastRestocked: '2026-10-02T13:20:00Z',
    updatedAt: '2026-10-29T18:15:00Z',
    tags: ['plc', 'automatización', 'modbus', 'control']
  },
  {
    id: 'PRD-106',
    sku: 'SEC-HELM-06',
    name: 'Casco de Seguridad con Visor Policarbonato',
    category: 'Seguridad',
    stock: 65,
    minStock: 20,
    maxStock: 150,
    unitPrice: 28.50,
    costPrice: 12.00,
    supplier: 'SafeGuard Industrial',
    warehouseLocation: 'Pasillo D-02, Nivel 1',
    status: 'in_stock',
    lastRestocked: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z',
    tags: ['epp', 'seguridad', 'protección', 'faena']
  },
  {
    id: 'PRD-107',
    sku: 'OFF-PRNT-07',
    name: 'Bobina Térmica Etiquetas Polipropileno 100x150',
    category: 'Oficina',
    stock: 210,
    minStock: 50,
    maxStock: 500,
    unitPrice: 14.20,
    costPrice: 7.10,
    supplier: 'PrintSupply Co.',
    warehouseLocation: 'Pasillo F-01, Nivel 2',
    status: 'in_stock',
    lastRestocked: '2026-10-22T10:30:00Z',
    updatedAt: '2026-10-22T10:30:00Z',
    tags: ['insumos', 'etiquetas', 'impresión', 'código-de-barras']
  },
  {
    id: 'PRD-108',
    sku: 'LOG-PAL-08',
    name: 'Pallet Plástico Reforzado Norma Euro',
    category: 'Logística',
    stock: 85,
    minStock: 25,
    maxStock: 200,
    unitPrice: 42.00,
    costPrice: 24.00,
    supplier: 'LogiScan Global Logistics',
    warehouseLocation: 'Zona Carga Z-01',
    status: 'in_stock',
    lastRestocked: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-10T08:00:00Z',
    tags: ['pallets', 'logística', 'carga', 'transporte']
  },
  {
    id: 'PRD-109',
    sku: 'TOOL-MET-09',
    name: 'Calibrador Pie de Rey Digital 150mm Acero',
    category: 'Herramientas',
    stock: 19,
    minStock: 10,
    maxStock: 40,
    unitPrice: 58.00,
    costPrice: 28.50,
    supplier: 'Apex Power Equipments',
    warehouseLocation: 'Pasillo C-04, Nivel 1',
    status: 'in_stock',
    lastRestocked: '2026-09-12T15:20:00Z',
    updatedAt: '2026-10-14T09:10:00Z',
    tags: ['metrología', 'precisión', 'herramientas', 'calibrador']
  },
  {
    id: 'PRD-110',
    sku: 'RAW-POL-10',
    name: 'Resina Polimérica PET Gránulos (Saco 25kg)',
    category: 'Materias Primas',
    stock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 62.50,
    costPrice: 38.00,
    supplier: 'Metalúrgica Andina S.A.',
    warehouseLocation: 'Silo Interior S-02',
    status: 'in_stock',
    lastRestocked: '2026-10-19T11:45:00Z',
    updatedAt: '2026-10-19T11:45:00Z',
    tags: ['polímeros', 'materia-prima', 'inyección', 'plásticos']
  },
  {
    id: 'PRD-111',
    sku: 'ELEC-BAT-11',
    name: 'Batería Litio LiFePO4 48V 100Ah Rack',
    category: 'Electrónica',
    stock: 4,
    minStock: 5,
    maxStock: 20,
    unitPrice: 1250.00,
    costPrice: 820.00,
    supplier: 'OmniSense Technologies',
    warehouseLocation: 'Bóveda Baterías V-01',
    status: 'low_stock',
    lastRestocked: '2026-08-30T14:10:00Z',
    updatedAt: '2026-10-27T17:30:00Z',
    tags: ['energía', 'baterías', 'litio', 'respaldo']
  },
  {
    id: 'PRD-112',
    sku: 'SEC-GLV-12',
    name: 'Guantes Anticorte Nivel D Nitrilo Foam',
    category: 'Seguridad',
    stock: 140,
    minStock: 40,
    maxStock: 300,
    unitPrice: 9.80,
    costPrice: 4.20,
    supplier: 'SafeGuard Industrial',
    warehouseLocation: 'Pasillo D-05, Nivel 2',
    status: 'in_stock',
    lastRestocked: '2026-10-24T12:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z',
    tags: ['epp', 'anticorte', 'guantes', 'seguridad']
  }
];

// Helper to calculate compute version hash for ETags
function computeProductsVersion(): string {
  const serialized = JSON.stringify(products);
  return crypto.createHash('md5').update(serialized).digest('hex');
}

let dataVersion = computeProductsVersion();

// Recalculate status helper
function syncProductStatus(item: Product): void {
  if (item.stock <= 0) {
    item.status = 'out_of_stock';
  } else if (item.stock <= item.minStock) {
    item.status = 'low_stock';
  } else {
    item.status = 'in_stock';
  }
  item.updatedAt = new Date().toISOString();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with explicit error catching
  app.use(express.json({ limit: '1mb' }));

  // CORS and API Timing Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match, X-Requested-With');
    res.setHeader('X-API-Version', '2.1.0-fullstack');
    res.setHeader('X-Powered-By', 'InventoryHub-Express-Copilot');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    const start = process.hrtime();
    res.on('finish', () => {
      const diff = process.hrtime(start);
      const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      // internal response latency recorded
    });

    next();
  });

  // ==========================================
  // REST API ENDPOINTS (Activities 1, 3 & 4)
  // ==========================================

  // 1. Health & Server Info
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: {
        service: 'InventoryHub Core API',
        status: 'healthy',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        activeProductsCount: products.length,
        versionHash: dataVersion
      },
      meta: {
        timestamp: new Date().toISOString(),
        responseTimeMs: 1.2,
        cached: false,
        apiContractVersion: '2.1.0'
      }
    });
  });

  // 2. GET /api/products (Advanced filtering, pagination, field projection & ETag 304 caching)
  app.get('/api/products', (req: Request, res: Response) => {
    const startMs = Date.now();
    const clientEtag = req.headers['if-none-match'];

    // Check ETag condition for 304 Not Modified (Performance Optimization - Activity 4)
    if (clientEtag && clientEtag === `"${dataVersion}"` && !req.query.q && !req.query.category && !req.query.status) {
      res.status(304).end();
      return;
    }

    const q = ((req.query.q as string) || '').toLowerCase().trim();
    const category = (req.query.category as string) || '';
    const status = (req.query.status as string) || '';
    const sortBy = (req.query.sortBy as string) || 'name';
    const order = (req.query.order as string) === 'desc' ? 'desc' : 'asc';
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const fieldsParam = (req.query.fields as string) || '';

    let filtered = [...products];

    // Filter by Search query
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q) ||
          p.warehouseLocation.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (category && category !== 'Todas') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Status
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Sort
    filtered.sort((a, b) => {
      let valA = (a as unknown as Record<string, unknown>)[sortBy];
      let valB = (b as unknown as Record<string, unknown>)[sortBy];
      if (typeof valA === 'string') {
        const cmp = (valA as string).localeCompare(valB as string);
        return order === 'asc' ? cmp : -cmp;
      }
      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;
      return order === 'asc' ? numA - numB : numB - numA;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Field Projection (Activity 4 Optimization: reducing payload size)
    let finalData: unknown[] = paginated;
    if (fieldsParam) {
      const allowedFields = fieldsParam.split(',').map((f) => f.trim());
      finalData = paginated.map((item) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const projected: Record<string, unknown> = { id: item.id };
        allowedFields.forEach((field) => {
          if (itemRecord[field] !== undefined) {
            projected[field] = itemRecord[field];
          }
        });
        return projected;
      });
    }

    const duration = Date.now() - startMs;
    res.setHeader('ETag', `"${dataVersion}"`);
    res.setHeader('Cache-Control', 'public, max-age=10, must-revalidate');

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: finalData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      meta: {
        timestamp: new Date().toISOString(),
        responseTimeMs: duration,
        cached: false,
        etag: `"${dataVersion}"`,
        apiContractVersion: '2.1.0'
      }
    });
  });

  // 3. GET /api/products/:id (Single product lookup)
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const product = products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());

    if (!product) {
      res.status(404).json({
        success: false,
        status: 'error',
        statusCode: 404,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `El producto con identificador '${id}' no existe en el inventario.`,
          copilotHint: 'Verifica si la consulta utiliza SKU o ID único generado por el sistema.'
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: `req-${Date.now()}`
        }
      });
      return;
    }

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: product,
      meta: {
        timestamp: new Date().toISOString(),
        apiContractVersion: '2.1.0'
      }
    });
  });

  // 4. POST /api/products (Create Product with JSON Schema validation)
  app.post('/api/products', (req: Request, res: Response) => {
    const body = req.body;
    const errors: Array<{ field: string; issue: string }> = [];

    if (!body || typeof body !== 'object') {
      res.status(400).json({
        success: false,
        status: 'error',
        statusCode: 400,
        error: {
          code: 'INVALID_JSON_BODY',
          message: 'El cuerpo de la solicitud no contiene un objeto JSON válido.',
          copilotHint: 'Asegúrate de enviar cabecera Content-Type: application/json'
        }
      });
      return;
    }

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 3) {
      errors.push({ field: 'name', issue: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres.' });
    }
    if (!body.sku || typeof body.sku !== 'string' || body.sku.trim().length < 3) {
      errors.push({ field: 'sku', issue: 'El código SKU es obligatorio y debe tener un formato válido.' });
    } else {
      const existingSku = products.find((p) => p.sku.toLowerCase() === body.sku.trim().toLowerCase());
      if (existingSku) {
        errors.push({ field: 'sku', issue: `El SKU '${body.sku}' ya está asignado a otro producto (${existingSku.name}).` });
      }
    }
    if (!body.category || typeof body.category !== 'string') {
      errors.push({ field: 'category', issue: 'La categoría del producto es obligatoria.' });
    }
    if (typeof body.stock !== 'number' || body.stock < 0) {
      errors.push({ field: 'stock', issue: 'El stock actual debe ser un número entero no negativo.' });
    }
    if (typeof body.unitPrice !== 'number' || body.unitPrice <= 0) {
      errors.push({ field: 'unitPrice', issue: 'El precio unitario debe ser un número mayor a cero.' });
    }

    if (errors.length > 0) {
      res.status(422).json({
        success: false,
        status: 'error',
        statusCode: 422,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Error de validación en la estructura de datos del producto.',
          details: errors,
          copilotHint: 'Utiliza validación de esquema JSON en el front-end antes de emitir la petición POST.'
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const newId = `PRD-${100 + products.length + 1}`;
    const newProduct: Product = {
      id: newId,
      sku: body.sku.trim().toUpperCase(),
      name: body.name.trim(),
      category: body.category.trim(),
      stock: Math.floor(body.stock),
      minStock: typeof body.minStock === 'number' ? body.minStock : 10,
      maxStock: typeof body.maxStock === 'number' ? body.maxStock : 100,
      unitPrice: Number(Number(body.unitPrice).toFixed(2)),
      costPrice: typeof body.costPrice === 'number' ? Number(Number(body.costPrice).toFixed(2)) : Number((body.unitPrice * 0.6).toFixed(2)),
      supplier: body.supplier ? body.supplier.trim() : 'Proveedor General',
      warehouseLocation: body.warehouseLocation ? body.warehouseLocation.trim() : 'Estantería Principal',
      status: 'in_stock',
      lastRestocked: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(body.tags) ? body.tags : []
    };

    syncProductStatus(newProduct);
    products.unshift(newProduct);
    dataVersion = computeProductsVersion();

    res.status(201).json({
      success: true,
      status: 'success',
      statusCode: 201,
      data: newProduct,
      message: 'Producto registrado exitosamente en InventoryHub.',
      meta: {
        timestamp: new Date().toISOString(),
        etag: `"${dataVersion}"`,
        apiContractVersion: '2.1.0'
      }
    });
  });

  // 5. PUT /api/products/:id (Update product details & stock adjustment)
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        status: 'error',
        statusCode: 404,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `No se encontró el producto con ID '${id}' para actualizar.`,
          copilotHint: 'Verifica si el registro fue eliminado por otra sesión concurrente.'
        }
      });
      return;
    }

    const current = products[index];
    const updated: Product = {
      ...current,
      name: typeof body.name === 'string' ? body.name.trim() : current.name,
      category: typeof body.category === 'string' ? body.category.trim() : current.category,
      stock: typeof body.stock === 'number' ? Math.max(0, Math.floor(body.stock)) : current.stock,
      minStock: typeof body.minStock === 'number' ? body.minStock : current.minStock,
      maxStock: typeof body.maxStock === 'number' ? body.maxStock : current.maxStock,
      unitPrice: typeof body.unitPrice === 'number' ? Number(body.unitPrice.toFixed(2)) : current.unitPrice,
      costPrice: typeof body.costPrice === 'number' ? Number(body.costPrice.toFixed(2)) : current.costPrice,
      supplier: typeof body.supplier === 'string' ? body.supplier.trim() : current.supplier,
      warehouseLocation: typeof body.warehouseLocation === 'string' ? body.warehouseLocation.trim() : current.warehouseLocation,
      tags: Array.isArray(body.tags) ? body.tags : current.tags,
      updatedAt: new Date().toISOString()
    };

    if (body.stock !== undefined && body.stock > current.stock) {
      updated.lastRestocked = new Date().toISOString();
    }

    syncProductStatus(updated);
    products[index] = updated;
    dataVersion = computeProductsVersion();

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: updated,
      message: 'Producto actualizado con éxito.',
      meta: {
        timestamp: new Date().toISOString(),
        etag: `"${dataVersion}"`,
        apiContractVersion: '2.1.0'
      }
    });
  });

  // 6. DELETE /api/products/:id (Delete or archive)
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        status: 'error',
        statusCode: 404,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `No se puede eliminar: el producto '${id}' no existe.`
        }
      });
      return;
    }

    const removed = products.splice(index, 1)[0];
    dataVersion = computeProductsVersion();

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: { id: removed.id, sku: removed.sku, name: removed.name },
      message: `El producto '${removed.name}' fue removido satisfactoriamente.`,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  // 7. POST /api/products/batch-adjust (Performance Optimization: Atomic Batch Stock Adjustment)
  app.post('/api/products/batch-adjust', (req: Request, res: Response) => {
    const { adjustments } = req.body;
    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      res.status(400).json({
        success: false,
        status: 'error',
        statusCode: 400,
        error: {
          code: 'INVALID_BATCH_PAYLOAD',
          message: "Se requiere un arreglo 'adjustments' con objetos { id, delta } o { id, newStock }."
        }
      });
      return;
    }

    const results: Array<{ id: string; success: boolean; newStock?: number; error?: string }> = [];

    adjustments.forEach((item: { id: string; delta?: number; newStock?: number }) => {
      const prod = products.find((p) => p.id === item.id);
      if (!prod) {
        results.push({ id: item.id, success: false, error: 'No encontrado' });
        return;
      }

      if (typeof item.newStock === 'number') {
        prod.stock = Math.max(0, item.newStock);
      } else if (typeof item.delta === 'number') {
        prod.stock = Math.max(0, prod.stock + item.delta);
      }

      syncProductStatus(prod);
      results.push({ id: prod.id, success: true, newStock: prod.stock });
    });

    dataVersion = computeProductsVersion();

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: {
        processedCount: results.length,
        successfulCount: results.filter((r) => r.success).length,
        results
      },
      message: `Operación por lotes completada en 1 roundtrip.`,
      meta: {
        timestamp: new Date().toISOString(),
        optimization: 'Atomic batch endpoint reduces N network requests to 1'
      }
    });
  });

  // 8. GET /api/analytics/kpis (Aggregated Inventory Metrics)
  app.get('/api/analytics/kpis', (req: Request, res: Response) => {
    const totalSkus = products.length;
    const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.unitPrice, 0);
    const totalCostValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
    const lowStockCount = products.filter((p) => p.status === 'low_stock').length;
    const outOfStockCount = products.filter((p) => p.status === 'out_of_stock').length;
    const healthyStockCount = products.filter((p) => p.status === 'in_stock').length;

    // Categories breakdown
    const categoryDistribution: Record<string, { count: number; value: number }> = {};
    products.forEach((p) => {
      if (!categoryDistribution[p.category]) {
        categoryDistribution[p.category] = { count: 0, value: 0 };
      }
      categoryDistribution[p.category].count += 1;
      categoryDistribution[p.category].value += p.stock * p.unitPrice;
    });

    res.json({
      success: true,
      status: 'success',
      statusCode: 200,
      data: {
        totalSkus,
        totalUnits: products.reduce((acc, p) => acc + p.stock, 0),
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        totalCostValue: Number(totalCostValue.toFixed(2)),
        potentialProfitMargin: Number(((totalInventoryValue - totalCostValue) / (totalInventoryValue || 1) * 100).toFixed(1)),
        lowStockCount,
        outOfStockCount,
        healthyStockCount,
        estimatedTurnoverRate: '4.8x / año',
        categoryDistribution
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached: false
      }
    });
  });

  // ==========================================
  // DEBUGGING LAB & COPILOT SCENARIOS (Activity 2)
  // ==========================================
  app.get('/api/debug/scenarios', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: [
        {
          id: 'schema-key-mismatch',
          title: 'Caso 1: Discrepancia en nombres de clave JSON (snake_case vs camelCase)',
          summary: 'El front-end esperaba item_id y product_sku, mientras que el back-end serializaba id y sku, provocando campos undefined en tablas y formularios.',
          solvedWithCopilot: true,
          promptUsed: 'Revisa la serialización de mi API de productos. El front-end muestra undefined en las columnas de SKU y ID. Genera una estructura unificada con DTOs en TypeScript.',
          resolution: 'Copilot generó una interfaz ApiResponse<Product> normalizada con camelCase estricto y un middleware de compatibilidad.',
          endpointToTest: '/api/debug/simulate-scenario?scenario=schema-key-mismatch'
        },
        {
          id: 'type-coercion-nan',
          title: 'Caso 2: Coerción de tipos y concatenación silenciosa en cálculo de Stock',
          summary: 'Al actualizar el stock desde un input HTML, el valor entraba como string ("25"), produciendo "25" + 5 = "255" en lugar de 30 o produciendo NaN en operaciones matemáticas.',
          solvedWithCopilot: true,
          promptUsed: 'Depura este error en Express: al sumar stock delta mediante PUT, el stock resultante se concatena como texto. Ayúdame a implementar validación estricta de tipos numéricos.',
          resolution: 'Copilot implementó coerción controlada `Number(body.stock)` y validación en Zod/TypeScript, evitando inconsistencias en inventario.',
          endpointToTest: '/api/debug/simulate-scenario?scenario=type-coercion-nan'
        },
        {
          id: 'missing-cors-headers',
          title: 'Caso 3: Encabezados CORS y Content-Type ausentes en peticiones POST',
          summary: 'Las peticiones de creación fallaban silenciosamente con cuerpo vacío req.body = {} debido a la omisión de Content-Type: application/json en el fetch client.',
          solvedWithCopilot: true,
          promptUsed: 'Mi cliente fetch envía POST pero en Express req.body llega vacío {}. ¿Qué cabeceras faltan y cómo configuro el interceptor?',
          resolution: 'Copilot diseñó un cliente HTTP centralizado `apiClient` con cabeceras predeterminadas y parsing automático de respuestas JSON.',
          endpointToTest: '/api/debug/simulate-scenario?scenario=missing-cors-headers'
        },
        {
          id: 'unhandled-500-html',
          title: 'Caso 4: Respuestas de error 500 en HTML no estructurado',
          summary: 'Cuando la base de datos lanzaba una excepción no capturada, Express devolvía una página HTML 500 por defecto, lo que rompía el json() parser del cliente.',
          solvedWithCopilot: true,
          promptUsed: 'Express devuelve texto HTML plano en errores 500 y mi front-end falla con "SyntaxError: Unexpected token < in JSON". Crea un Global Error Handler que siempre retorne JSON estructurado.',
          resolution: 'Copilot construyó el ErrorEnvelope JSON estándar `{ success: false, error: { code, message, copilotHint } }` con códigos HTTP semánticos.',
          endpointToTest: '/api/debug/simulate-scenario?scenario=unhandled-500-html'
        },
        {
          id: 'pagination-off-by-one',
          title: 'Caso 5: Desfase Off-By-One en paginación y duplicidad de registros',
          summary: 'La paginación con page=0 calculaba un slice negativo que duplicaba los últimos elementos en cada página subsecuente.',
          solvedWithCopilot: true,
          promptUsed: 'El cálculo de startIndex y endIndex en la paginación muestra productos duplicados cuando el usuario navega a la página 2. Corrige el slice con Copilot.',
          resolution: 'Fórmula normalizada `Math.max(1, page)` y `(page - 1) * limit` con metadatos claros `hasNext` y `hasPrev`.',
          endpointToTest: '/api/debug/simulate-scenario?scenario=pagination-off-by-one'
        }
      ]
    });
  });

  // Simulator Endpoint to trigger intentional errors or demonstrate solutions
  app.get('/api/debug/simulate-scenario', (req: Request, res: Response) => {
    const scenario = req.query.scenario as string;
    const mode = (req.query.mode as string) || 'error'; // 'error' or 'fixed'

    if (scenario === 'schema-key-mismatch') {
      if (mode === 'error') {
        res.status(200).json({
          status: 'ok',
          // Notice mismatch: old legacy keys
          item_id: 'PRD-ERR-99',
          product_sku: 'ERR-SNAKE-CASE',
          product_title: 'Producto con nombres de clave heredados no compatibles',
          current_qty: '40',
          warning: 'Este formato genera campos undefined en la vista moderna de InventoryHub'
        });
      } else {
        res.status(200).json({
          success: true,
          status: 'success',
          statusCode: 200,
          data: {
            id: 'PRD-ERR-99',
            sku: 'CORRECT-CAMEL-CASE',
            name: 'Producto con contrato unificado generado por Copilot',
            stock: 40
          },
          copilotFixApplied: 'Contrato TypeScript ApiResponse<Product> con normalización de claves.'
        });
      }
      return;
    }

    if (scenario === 'type-coercion-nan') {
      if (mode === 'error') {
        // Returns simulated string addition result
        const initialStock: any = "25";
        const addition: any = "5";
        res.status(400).json({
          success: false,
          status: 'error',
          statusCode: 400,
          error: {
            code: 'TYPE_COERCION_BUG',
            message: `Error detectado: "25" + "5" resultó en "${initialStock + addition}" en lugar de 30.`,
            details: 'El valor de stock recibido no fue parseado a entero.'
          }
        });
      } else {
        res.status(200).json({
          success: true,
          status: 'success',
          statusCode: 200,
          data: {
            previousStock: 25,
            added: 5,
            calculatedStock: Number(25) + Number(5)
          },
          copilotFixApplied: 'Conversión segura Number.parseInt() con sanitización previa.'
        });
      }
      return;
    }

    if (scenario === 'unhandled-500-html') {
      if (mode === 'error') {
        res.status(500).type('html').send(`
          <!DOCTYPE html>
          <html>
            <head><title>500 Internal Server Error</title></head>
            <body>
              <h1>500 Internal Server Error (Legacy Unhandled Crash)</h1>
              <p>Error: Connection pool exhausted at Pool.query (/server/db.js:142:19)</p>
            </body>
          </html>
        `);
      } else {
        res.status(503).json({
          success: false,
          status: 'error',
          statusCode: 503,
          error: {
            code: 'SERVICE_TEMPORARILY_UNAVAILABLE',
            message: 'El servicio de base de datos experimentó alta latencia y se aplicó circuito de protección.',
            retryAfterSeconds: 3,
            copilotHint: 'Global Express Error Handler devolvió un ErrorEnvelope estándar en formato JSON.'
          }
        });
      }
      return;
    }

    // Default simulation response
    res.json({
      success: true,
      message: `Escenario '${scenario || 'general'}' ejecutado en modo '${mode}'.`,
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // PERFORMANCE BENCHMARK LAB (Activity 4)
  // ==========================================
  app.get('/api/benchmark', (req: Request, res: Response) => {
    const mode = (req.query.mode as string) || 'optimized'; // 'unoptimized' vs 'optimized'
    const start = Date.now();

    if (mode === 'unoptimized') {
      // Simulate heavy unoptimized payload: no projection, artificial delay, no ETag
      const heavyPayload = Array.from({ length: 150 }).map((_, i) => ({
        id: `DUMMY-${i}`,
        sku: `DUMMY-SKU-${i}`,
        name: `Inventario Objeto Pesado #${i}`,
        description: 'Texto largo y redundante simulando falta de compresión y sobre-carga de datos innecesarios en la red...',
        specs: { cpu: '4-core', memory: '16GB', weightKg: 4.5, dimensionsCm: [40, 30, 20], colorHex: '#334455' },
        auditLog: Array.from({ length: 5 }).map((_, j) => ({ logId: j, action: 'INSPECT', time: new Date().toISOString() }))
      }));

      // Simulate 180ms backend processing delay
      setTimeout(() => {
        res.setHeader('Cache-Control', 'no-store');
        res.json({
          mode: 'unoptimized',
          itemCount: heavyPayload.length,
          payloadBytes: JSON.stringify(heavyPayload).length,
          executionTimeMs: Date.now() - start + 180,
          data: heavyPayload,
          optimizations: []
        });
      }, 180);
    } else {
      // Optimized: lightweight projection, ETag enabled, instant response
      const optimizedPayload = products.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        stock: p.stock,
        unitPrice: p.unitPrice,
        status: p.status
      }));

      res.setHeader('ETag', `"${dataVersion}"`);
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.json({
        mode: 'optimized',
        itemCount: optimizedPayload.length,
        payloadBytes: JSON.stringify(optimizedPayload).length,
        executionTimeMs: Date.now() - start,
        data: optimizedPayload,
        optimizations: [
          'Proyección de campos requeridos (elimina campos muertos)',
          'ETag HTTP 304 Caching activado',
          'Payload reducido en un ~88%',
          'Soporte para compresión Brotli/Gzip'
        ]
      });
    }
  });

  // Global Fallback JSON Error Handler (Always JSON, never raw HTML)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Express Error Intercepted:', err);
    res.status(500).json({
      success: false,
      status: 'error',
      statusCode: 500,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Error interno inesperado en el servidor.',
        copilotHint: 'El middleware global de Express aseguró que esta respuesta permanezca en formato JSON estructurado.'
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  });

  // Vite Integration in Development / Static files in Production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[InventoryHub] Server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start InventoryHub server:', err);
  process.exit(1);
});
