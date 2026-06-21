export interface FavoriteItem {
  id: string; // ürün ID'si (productId)
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
}

export interface CartItem {
  id: string; // Sepetteki ürün için benzersiz kimlik (ürün ID'si + numara)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  imageUrl: string;
}

export interface MockPaymentDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingDetails: {
    fullName: string;
    address: string;
    phone: string;
  };
  paymentDetails: MockPaymentDetails;
  totalAmount: number;
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
  orderNumber: string;
}

export interface ShoeData {
  id: string;
  index: number;
  name: string;
  brand: string;
  price: string | number | null;
  imageUrl: string;
  image_url: string;
  category: { name: string };
  primary_color: string;
  primary_color_hex: string;
}

export interface MappedShoeData extends ShoeData {
  randomDelay?: number;
  basePos: {
    x: number;
    y: number;
  };
  matchesFilter?: boolean;
}
