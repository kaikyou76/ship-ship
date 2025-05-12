import {
  StarIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ProductImage from "../../components/ProductImage";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  rating?: number;
  category?: string;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8787";
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("商品取得エラー:", error);
    return null;
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  const getPlaceholderImage = (id: number) => {
    const imageIndex = (id % 5) + 1;
    return `/placeholder-${imageIndex}.jpg`;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto py-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              商品が見つかりません
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              お探しの商品は削除されたか、URLが間違っている可能性があります
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              商品一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            商品一覧に戻る
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <ProductImage
                  id={product.id}
                  imageUrl={
                    product.image_url || getPlaceholderImage(product.id)
                  }
                  alt={product.name}
                />
                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    売り切れ
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {product.category && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {product.category}
                    </span>
                  )}
                  {product.rating && (
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-gray-600 dark:text-gray-300">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ¥{product.price.toLocaleString()}
                  </span>
                  {product.stock > 0 && (
                    <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                      在庫: {product.stock}個
                    </span>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  disabled={product.stock <= 0}
                  className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                    product.stock > 0
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } md:py-4 md:text-lg md:px-10 transition`}
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-2" />
                  {product.stock > 0 ? "カートに追加" : "売り切れ"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            商品詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                仕様
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• カテゴリー: {product.category || "未設定"}</li>
                <li>• 商品ID: {product.id}</li>
                <li>• 価格: ¥{product.price.toLocaleString()}</li>
                <li>
                  • 在庫状況: {product.stock > 0 ? "在庫あり" : "在庫切れ"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                配送情報
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 配送方法: 宅配便</li>
                <li>• 配送料: 全国一律¥600</li>
                <li>• 発送予定日: 1-3営業日以内</li>
                <li>• 返品条件: 到着後7日以内</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
