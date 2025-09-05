import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
      const productData = JSON.parse(req.body.productData);
      const images = req.files || [];
  
      let imagesUrl = [];
  
      if (images.length > 0) {
        imagesUrl = await Promise.all(
          images.map(async (item) => {
            // If using disk storage, item.path works. If memory storage, use item.buffer with cloudinary.upload_stream
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        );
      }
  
      const newProduct = await Product.create({ ...productData, image: imagesUrl });
  
      // ✅ Send a response to avoid pending request
      res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true } // return updated doc
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Stock Updated", product: updatedProduct });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};