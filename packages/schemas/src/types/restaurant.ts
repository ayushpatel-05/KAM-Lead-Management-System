export interface RestaurantFilter {
    id: string;
    name: string;
    address: AddressFilter | null;
    user: string;
}

interface AddressFilter {
    id: string;
    addressLine1: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
}