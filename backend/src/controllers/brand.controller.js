import * as brandService from "../services/brand.service.js";

export async function listBrands(req, res, next) {
  try {
    const brands = await brandService.listBrandsForUser(req.user);
    res.status(200).json({ brands });
  } catch (error) {
    next(error);
  }
}

export async function getBrand(req, res, next) {
  try {
    const brand = await brandService.getBrandById(req.params.brandId, req.user);
    res.status(200).json({ brand });
  } catch (error) {
    next(error);
  }
}

export async function createBrand(req, res, next) {
  try {
    const brand = await brandService.createBrand(req.body, req.user);
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    next(error);
  }
}

export async function updateBrand(req, res, next) {
  try {
    const brand = await brandService.updateBrand(req.params.brandId, req.body, req.user);
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (error) {
    next(error);
  }
}

export async function deleteBrand(req, res, next) {
  try {
    const result = await brandService.deleteBrand(req.params.brandId, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listBrandWorkspaces(req, res, next) {
  try {
    const workspaces = await brandService.listBrandWorkspaces(req.params.brandId, req.user);
    res.status(200).json({ workspaces });
  } catch (error) {
    next(error);
  }
}