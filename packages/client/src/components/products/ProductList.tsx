import { type ApiResponse } from '@/common/interfaces/api-response';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
};

function ProductCard({ product }: { product: Product }) {
    const navigate = useNavigate();

    const navigateToReview = () => {
        navigate(`/product/${product.id}/review`);
    };
    return (
        <div
            onClick={navigateToReview}
            className="max-w-md rounded-lg shadow-lg bg-white p-6 m-4 flex flex-col gap-1 cursor-pointer"
        >
            <div>{product.name}</div>
            <div className="mb-1">{product.description}</div>
            <div className="self-end">{product.price}</div>
        </div>
    );
}

type GetProductsResponse = {
    products: Product[];
};

export default function ProductList() {
    const {
        isLoading,
        error,
        data: products,
    } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => fetchProducts(),
        enabled: true,
        retry: 2,
    });

    const fetchProducts = async () => {
        const res =
            await axios.get<ApiResponse<GetProductsResponse>>(
                '/api/v1/products'
            );
        return res.data.data.products;
    };
    console.log({ isLoading, error, products });

    if (isLoading) {
        return (
            <div>
                <Skeleton width={500} height={50} />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error.message}</p>;
    }

    return (
        <div className="w-full h-full p-2 flex flex-col gap-2">
            <h1 className="text-4xl mb-7">Products</h1>
            {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
