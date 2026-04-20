import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';
import { InventoryService } from '../services/implementations/inventory.service.js';
import { InventoryRepository } from '../repositories/implementations/inventory.repository.js';

const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository);
const inventoryController = new InventoryController(inventoryService);

const router = Router();

router.get('/admin/inventory', (req, res, next) => inventoryController.getAll(req, res, next));
router.put('/admin/inventory/:productId', (req, res, next) => inventoryController.updateStock(req, res, next));

export default router;