import { create } from 'zustand';

export interface CartCustomOptions {
  customText?: string;
  dimensionLabelAr: string;
  dimensionLabelEn: string;
  materialLabelAr: string;
  materialLabelEn: string;
  ledColorNameAr?: string;
  ledColorNameEn?: string;
  ledHex?: string;
  logoFileName?: string;
  logoPreviewUrl?: string;
  fontName?: string;
  paperTypeAr?: string;
  paperTypeEn?: string;
  foilFinishAr?: string;
  foilFinishEn?: string;
  boxStyleAr?: string;
  boxStyleEn?: string;
  boxInsertAr?: string;
  boxInsertEn?: string;
  standTypeAr?: string;
  standTypeEn?: string;
  portraitStyleAr?: string;
  portraitStyleEn?: string;
  weddingDates?: {
    met?: string;
    engaged?: string;
    contract?: string;
    wedding?: string;
  };
  notes?: string;
  discountPercentage?: number;
  customFormData?: Record<string, any>;
  uploadedFileUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  titleAr: string;
  titleEn: string;
  image: string;
  category: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice?: number;
  totalPrice: number;
  customOptions: CartCustomOptions;
  customFormData?: Record<string, any>;
  uploadedFileUrl?: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  deliveryType: 'standard' | 'express';
  shippingCost: number;
}

export type PaymentMethod = 'zaincash' | 'fib' | 'cod' | 'stripe' | 'paypal';

export type ManufacturingStatus =
  | 'under_review'        // قيد المراجعة
  | 'designing'           // قيد التصميم
  | 'printing'            // في المطبعة
  | 'ready_for_shipping'  // جاهز للشحن
  | 'delivered';          // تم التسليم

export interface ManufacturingStageLog {
  stage: ManufacturingStatus;
  timestamp: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  artisanName?: string;
  stationName?: string;
  checklist?: string[];
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    transactionId?: string;
    status: 'paid' | 'pending_cod';
    gatewayNameAr: string;
    gatewayNameEn: string;
  };
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  manufacturingStatus?: ManufacturingStatus;
  manufacturingStepIndex?: number;
  estimatedDelivery?: string;
  stageLogs?: ManufacturingStageLog[];
  workshopNotes?: string;
  source?: string;
  campaignSlug?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastOrder: OrderRecord | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setLastOrder: (order: OrderRecord | null) => void;
  getTotalItemsCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  lastOrder: null,
  addItem: (itemData) => {
    const newItem: CartItem = {
      ...itemData,
      id: `${itemData.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    set((state) => ({
      items: [newItem, ...state.items],
      isOpen: true, // open drawer on add to acknowledge user action
    }));
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  updateQuantity: (id, delta) => {
    set((state) => ({
      items: state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        }),
    }));
  },
  clearCart: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setLastOrder: (lastOrder) => set({ lastOrder }),
  getTotalItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
  },
}));
