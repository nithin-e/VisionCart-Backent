export const MESSAGES = {
  // Common / Shared
  COMMON: {
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    INVALID_STATUS_TRANSITION: (current: string, allowed: string) => 
      `Invalid status transition from '${current}'. Allowed transitions: ${allowed}`,
    ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
    ALREADY_INACTIVE: (resource: string) => `${resource} is already inactive`,
    REQUIRED: (field: string) => `${field} is required`,
    INVALID_FORMAT: (field: string) => `Invalid ${field} format`,
    MUST_BE_BETWEEN: (field: string, min: number, max: number) => `${field} must be between ${min} and ${max}`,
    MUST_BE_POSITIVE: (field: string) => `${field} must be greater than 0`,
    CANNOT_BE_NEGATIVE: (field: string) => `${field} cannot be negative`,
  },

  // Products
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
    NOT_FOUND: 'Product not found',
    ALREADY_EXISTS: 'Product with this name already exists',
  },

  // Categories
  CATEGORY: {
    CREATED: 'Category created successfully',
    UPDATED: 'Category updated successfully',
    DELETED: 'Category deleted successfully',
    NOT_FOUND: 'Category not found',
    ALREADY_EXISTS: 'Category with this name already exists',
  },

  // Collections
  COLLECTION: {
    CREATED: 'Collection created successfully',
    UPDATED: 'Collection updated successfully',
    DELETED: 'Collection deleted successfully',
    NOT_FOUND: 'Collection not found',
    ALREADY_EXISTS: 'Collection with this name already exists',
    PRODUCTS_ASSIGNED: 'Products assigned to collection',
    INVALID_PRODUCT_IDS: (ids: string) => `Invalid product IDs: ${ids}`,
  },

  // Banners
  BANNER: {
    CREATED: 'Banner created successfully',
    UPDATED: 'Banner updated successfully',
    DELETED: 'Banner deleted successfully',
    NOT_FOUND: 'Banner not found',
    INVALID_TYPE: (allowed: string) => `Invalid banner type. Allowed values: ${allowed}`,
  },

  // Stores
  STORE: {
    CREATED: 'Store created successfully',
    UPDATED: 'Store updated successfully',
    DELETED: 'Store deleted successfully',
    NOT_FOUND: 'Store not found',
    LAT_INVALID: 'Latitude must be between -90 and 90',
    LNG_INVALID: 'Longitude must be between -180 and 180',
  },

  // Users
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
    BLOCKED: 'User blocked successfully',
    UNBLOCKED: 'User unblocked successfully',
    ALREADY_BLOCKED: 'User is already blocked',
    ALREADY_UNBLOCKED: 'User is already unblocked',
  },

  // Orders
  ORDER: {
    CREATED: 'Order created successfully',
    UPDATED: 'Order updated successfully',
    DELETED: 'Order deleted successfully',
    NOT_FOUND: 'Order not found',
    STATUS_UPDATED: 'Order status updated successfully',
    REFUND_PROCESSED: 'Refund processed successfully',
    ALREADY_REFUNDED: 'Order is already refunded',
    REFUND_INVALID: 'Refund can only be processed for delivered or cancelled orders',
  },

  // Payments
  PAYMENT: {
    CREATED: 'Payment created successfully',
    UPDATED: 'Payment updated successfully',
    NOT_FOUND: 'Payment not found',
  },

  // Inventory
  INVENTORY: {
    UPDATED: 'Stock updated successfully',
    NOT_FOUND: 'Product not found',
    STOCK_INVALID: 'Stock must be a non-negative integer',
  },

  // Coupons
  COUPON: {
    CREATED: 'Coupon created successfully',
    UPDATED: 'Coupon updated successfully',
    DELETED: 'Coupon deleted successfully',
    NOT_FOUND: 'Coupon not found',
    ALREADY_EXISTS: 'Coupon code already exists',
    DISCOUNT_INVALID: 'Discount must be greater than 0',
    PERCENTAGE_INVALID: 'Percentage discount must be between 1 and 100',
    EXPIRY_INVALID: 'Expiry date must be a future date',
    ALREADY_INACTIVE: 'Coupon is already inactive',
  },

  // Try at Home
  TRY_AT_HOME: {
    CREATED: 'Booking created successfully',
    UPDATED: 'Booking status updated successfully',
    NOT_FOUND: 'Booking not found',
    INVALID_STATUS: 'Invalid status value',
  },

  // Reviews
  REVIEW: {
    CREATED: 'Review created successfully',
    DELETED: 'Review removed successfully',
    NOT_FOUND: 'Review not found',
    ALREADY_HIDDEN: 'Review is already hidden',
  },

  // Blog
  BLOG: {
    CREATED: 'Blog created successfully',
    UPDATED: 'Blog updated successfully',
    DELETED: 'Blog deleted successfully',
    NOT_FOUND: 'Blog not found',
    TITLE_REQUIRED: 'Title is required',
    CONTENT_REQUIRED: 'Content is required',
    ALREADY_EXISTS: 'A blog with this title already exists',
    ALREADY_INACTIVE: 'Blog is already inactive',
  },

  // Franchise
  FRANCHISE: {
    CREATED: 'Application submitted successfully',
    UPDATED: 'Application status updated successfully',
    NOT_FOUND: 'Application not found',
    INVALID_STATUS: 'Invalid status value',
  },

  // Contact
  CONTACT: {
    CREATED: 'Message sent successfully',
    REPLY_SENT: 'Reply sent successfully',
    NOT_FOUND: 'Message not found',
    ALREADY_REPLIED: 'Message has already been replied to',
    REPLY_REQUIRED: 'Reply message is required',
  },

  // Notifications
  NOTIFICATION: {
    SENT: 'Notification sent successfully',
    TITLE_REQUIRED: 'Title is required',
    MESSAGE_REQUIRED: 'Message is required',
    USER_NOT_FOUND: 'User not found',
    NO_USERS: 'No users found to send broadcast',
  },

  // Reports
  REPORT: {
    SALES: 'Sales report fetched successfully',
    USERS: 'User report fetched successfully',
  },

  // Settings
  SETTINGS: {
    UPDATED: 'Settings updated successfully',
    FETCHED: 'Settings fetched successfully',
    TAX_INVALID: 'Tax percentage must be between 0 and 100',
    SHIPPING_INVALID: 'Shipping charge cannot be negative',
    THRESHOLD_INVALID: 'Free shipping threshold cannot be negative',
    EMAIL_INVALID: 'Invalid email format',
  },

  // Error messages from middleware
  ERROR: {
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
  },
} as const;

export type MessagesType = typeof MESSAGES;
