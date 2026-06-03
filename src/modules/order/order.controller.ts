import { Request, Response } from "express";
import { orderService } from "./order.service";
 

// * create Order
const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user || !("id" in req.user)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const customerId = (req.user as any).id;

    const result = await orderService.createOrder(customerId, req.body.items);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// * getMyoder

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.id;

    const result = await orderService.getMyOrders(customerId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

// * get order by Id

const getOrderById = async(req: Request, res: Response)=>{
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const result = await orderService.getOrderById(orderId);
    res.status(200).json({
      success: true,
      data: result,
    });
}

// * update order Status
const updateOrderStatus = async(req: Request, res: Response)=>{
  try{
    const {orderId}= req.params;
    const result = await orderService.updateOrderStatus(orderId as string, req.body)
    res.status(200).json({
      success: "Your Order is updated!",
      result
    })

  }catch(e: any){
    res.status(404).json({
      error: "order is not updated!",
      details: e.message
    })
  }
}


export const orderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
