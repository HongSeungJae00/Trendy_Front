'use client'

import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { ThumbsUp, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ReviewImageModal } from "@/components/review-image-modal"
import TopButton from "@/components/top-button"
import { RelatedProducts } from "@/components/related-products"
import Link from "next/link"
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const basePrice = 129000; // 129,000원

// 리뷰 인터페이스 수정
interface Review {
  review_id: number;
  user_id: number;
  product_id: number;
  content: string;
  image: string; // 이미지는 URL 문자열로 받을 것으로 예상
  category?: 'sexual' | 'violent' | 'bulling' | 'spam' | 'wrong_info'; // optional
  created_at: string;
  updated_at: string;
}

interface ReviewResponse {
  product: {
    id: number;
    name: string;
    // ... 다른 제품 필드들
  };
  totalReviews: number;
  reviews: Review[];
}

// 연관 제품 데이터
const relatedProducts = [
{
  id: "1",
  name: "나이키 에어맥스 97",
  brand: "나이키",
  price: 179000,
  imageUrl: "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+97"
},
{
  id: "2",
  name: "나이키 에어 조던 1 레트로 하이 OG",
  brand: "조던",
  price: 209000,
  imageUrl: "/placeholder.svg?height=400&width=400&text=Air+Jordan+1"
},
{
  id: "3",
  name: "나이키 덩크 로우",
  brand: "나이키",
  price: 129000,
  imageUrl: "/placeholder.svg?height=400&width=400&text=Nike+Dunk+Low"
},
{
  id: "4",
  name: "나이키 에어 포스 1 '07",
  brand: "나이키",
  price: 139000,
  imageUrl: "/placeholder.svg?height=400&width=400&text=Nike+Air+Force+1+07"
}
]

// Product 인터페이스 수정 - productCode 중복 제거
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  imageDetailUrl1?: string;
  imageDetailUrl2?: string;
  imageDetailUrl3?: string;
  description?: string;
  sizes?: string[];
  modelId?: string;
  productCode: string; // 하나로 통일
  likeCount: number;
}

// base64 디코딩 함수 수정
const decodeBase64Url = (base64Url: string) => {
  try {
    // base64 문자열이 실제로 base64인지 확인
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Url)) {
      return base64Url; // base64가 아니면 원래 문자열 반환
    }
    const decoded = atob(base64Url);
    return decoded;
  } catch (error) {
    console.error('Base64 디코딩 실패:', error);
    return base64Url; // 디코딩 실패시 원래 문자열 반환
  }
};

// 토큰 유효성 검사 함수 수정
const isValidToken = (token: string) => {
  try {
    // 토큰이 존재하는지 확인
    if (!token) return false;

    // JWT 토큰 디코딩
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload); // 디버깅용

    // exp가 문자열로 되어있는 경우를 처리
    const expTime = typeof payload.exp === 'string' 
      ? new Date(payload.exp).getTime()
      : payload.exp * 1000;

    // 현재 시간과 비교
    const currentTime = Date.now();
    console.log('Token expiration:', new Date(expTime).toLocaleString());
    console.log('Current time:', new Date(currentTime).toLocaleString());

    if (expTime < currentTime) {
      console.log('Token expired');
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [selectedReview, setSelectedReview] = useState<null | typeof reviews[0]>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [magnifiedPosition, setMagnifiedPosition] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product?.likeCount || 0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [zoomedDetailImage, setZoomedDetailImage] = useState<number | null>(null);
  const [detailZoomPosition, setDetailZoomPosition] = useState({ x: 0, y: 0 });
  const [fullScreenDetailImage, setFullScreenDetailImage] = useState<string | null>(null);
  const detailImageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [token, setToken] = useState<string | null>(null);

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    try {
      const jwtToken = window.localStorage.getItem('jwtToken');
      console.log('JWT 토큰 로드:', jwtToken);
      
      if (jwtToken) {
        const [, payload] = jwtToken.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const currentTime = Math.floor(Date.now() / 1000);

        console.log('토큰 정보:', {
          exp: new Date(decodedPayload.exp * 1000).toLocaleString(),
          currentTime: new Date(currentTime * 1000).toLocaleString(),
          email: decodedPayload.sub
        });

        if (decodedPayload.exp > currentTime) {
          console.log('토큰 유효, 상태 업데이트');
          setToken(jwtToken);
        } else {
          console.log('토큰 만료됨');
          window.localStorage.removeItem('jwtToken');
        }
      } else {
        console.log('토큰이 존재하지 않음');
      }
    } catch (error) {
      console.error('토큰 로드 중 에러:', error);
      window.localStorage.removeItem('jwtToken');
    }
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('상품 정보를 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        data.sizes = ['230', '240', '250', '260', '270', '280', '290']
        setProduct(data)
        setLoading(false)
      } catch (error) {
        console.error('상품 정보를 가져오는 중 오류 발생:', error)
        toast.error('상품 정보를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/review/products/${params.id}`)
        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error('리뷰를 가져오는 중 오류 발생:', error)
      }
    }

    fetchProductDetails()
    fetchReviews()
  }, [params.id])

  const scrollReviews = (direction: 'left' | 'right') => {
    if (!reviewsRef.current) return
    const scrollAmount = 300
    reviewsRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setZoomPosition({ x, y })
  }

  const handleMouseEnter = () => setIsZoomed(true)
  const handleMouseLeave = () => setIsZoomed(false)

  const handleFullScreenMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMagnifiedPosition({ x, y });
  };

  // 초기 좋아요 상태 로드 (로그인한 경우에만)
  useEffect(() => {
    if (token && product) {
      setLikeCount(product.likeCount);
    }
  }, [product, token]);

  const handleLike = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/products/${params.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('좋아요 처리에 실패했습니다.')
      }

      const updatedProduct = await response.json()
      // prev가 null이 아닌 경우에만 업데이트
      setProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likeCount: updatedProduct.likeCount
        }
      })
      toast.success('좋아요가 반영되었습니다.')
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error)
      toast.error('좋아요 처리에 실패했습니다.')
    }
  }

  const handleAddToCart = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: params.id,
          quantity: 1,
          // ... 기타 필요한 데이터
        }),
      })

      if (!response.ok) {
        throw new Error('장바구니 추가에 실패했습니다.')
      }

      toast.success('장바구니에 추가되었습니다.')
    } catch (error) {
      console.error('장바구니 추가 중 오류 발생:', error)
      toast.error('장바구니 추가에 실패했습니다.')
    }
  }

  // 상세 이미지용 이벤트 핸들러 추가
  const handleDetailMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!detailImageRefs.current[index]) return;
    const { left, top, width, height } = detailImageRefs.current[index]!.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setDetailZoomPosition({ x, y });
  };

  const handlePurchase = () => {
    if (!selectedSize) {
      toast.error('사이즈를 선택해주세요');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Current token:', token);

    if (!token || !isValidToken(token)) {
      localStorage.removeItem('token');
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }
    
    if (!product) {
      toast.error('상품 정보를 찾을 수 없습니다.');
      return;
    }
    
    const purchaseData = {
      productCode: product.productCode,
      name: product.name,
      brand: product.brand,
      image: product.imageUrl,
      size: selectedSize,
      quantity: quantity,
      price: product.price
    }
    
    localStorage.setItem('purchaseItems', JSON.stringify([purchaseData]))
    router.push('/purchase')
  }

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-8 py-8 flex items-center justify-center">
          <div className="text-xl">로딩중...</div>
        </div>
      </div>
    )
  }

  // 에러가 있을 때 표시할 UI
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-8 py-8 flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  // product가 없을 때 표시할 UI
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-8 py-8 flex items-center justify-center">
          <div className="text-xl">상품을 찾을 수 없습니다</div>
        </div>
      </div>
    )
  }

  // 이미지 갤러리 컴포넌트
  const ImageGallery = () => {
    if (!product?.imageUrl) {
      return (
        <div className="relative aspect-square">
          <Image
            src="/placeholder.svg"
            alt="상품 이미지 없음"
            fill
            className="object-contain"
          />
        </div>
      )
    }

    return (
      <div 
        ref={imageRef}
        className="relative w-full h-[400px] cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={product.imageUrl}
          alt={`${product.name} 이미지`}
          fill
          className="object-contain cursor-pointer"
          onClick={() => setIsFullScreen(true)}
        />
        {isZoomed && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>
    )
  }

  const ReviewImageModal = ({ 
    isOpen, 
    onClose, 
    imageUrl, 
    caption 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    imageUrl: string; 
    caption: string; 
  }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden" 
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-lg"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-[80vh]">
            <img
              src={decodeBase64Url(imageUrl)}
              alt={caption}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('모달 이미지 로드 실패:', imageUrl);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          {caption && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{caption}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="container mx-auto px-8 py-8 max-w-[90%] w-full">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-gray-50 p-6">
              <div 
                ref={imageRef}
                className="relative w-full h-[400px] cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} 이미지`}
                  fill
                  className="object-contain cursor-pointer"
                  onClick={() => setIsFullScreen(true)}
                />
                {isZoomed && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${product.imageUrl})`,
                      backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                      backgroundSize: '250%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6 px-4">
            <div className="space-y-2">
              <p className="text-gray-600">{product.brand}</p>
              <p className="text-sm text-gray-500">제품 코드: {product.modelId}</p>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            
            <p className="text-gray-700">{product.description}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">사이즈 선택</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="사이즈 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {product.sizes?.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">수량</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-600'}`} />
                <span className="text-gray-600">{product.likeCount}</span>
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600">가격</div>
                <div className="text-2xl font-bold">
                  {(product.price * quantity).toLocaleString()}원
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handlePurchase}
              >
                구매하기
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddToCart}
              >
                장바구니에 담기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Images Section */}
      <div className="container mx-auto px-8 py-12 max-w-[90%] w-full">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">상세 이미지</h2>
          <div className="space-y-4 flex flex-col items-center">
            {[product.imageDetailUrl1, product.imageDetailUrl2, product.imageDetailUrl3]
              .filter(Boolean)
              .map((imageUrl, index) => (
                <div key={index}>
                  <div
                    ref={(el) => {
                      detailImageRefs.current[index] = el;
                    }}
                    className="relative w-[500px] h-[500px] cursor-zoom-in"
                    onMouseMove={(e) => handleDetailMouseMove(e, index)}
                    onMouseEnter={() => setZoomedDetailImage(index)}
                    onMouseLeave={() => setZoomedDetailImage(null)}
                  >
                    <Image
                      src={imageUrl!}
                      alt={`상세 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      onClick={() => setFullScreenDetailImage(imageUrl!)}
                    />
                    {zoomedDetailImage === index && (
                      <div
                        className="absolute inset-0 pointer-events-none rounded-lg"
                        style={{
                          backgroundImage: `url(${imageUrl})`,
                          backgroundPosition: `${detailZoomPosition.x * 100}% ${detailZoomPosition.y * 100}%`,
                          backgroundSize: '250%',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-8 py-12 max-w-[90%] w-full">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">리뷰 사진</h2>
          
          {reviewLoading ? (
            <div className="text-center py-8">리뷰를 불러오는 중...</div>
          ) : reviews.length > 0 ? (
            <div className="relative w-3/4 mx-auto">
              <button 
                onClick={() => setCurrentReviewIndex((prevIndex) => 
                  (prevIndex - 1 + reviews.length) % reviews.length
                )}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex justify-between gap-4">
                {reviews.slice(currentReviewIndex, currentReviewIndex + 3).map((review, index) => (
                  <div
                    key={`review-${review.review_id}-${index}`}
                    className="flex-none w-[calc(33.33%-8px)] cursor-pointer"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="relative aspect-square mb-2">
                      {review.image ? (
                        <img
                          src={decodeBase64Url(review.image)}
                          alt={`리뷰 이미지 ${review.review_id}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            console.error('이미지 로드 실패:', review.image);
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">이미지 없음</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{review.content}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setCurrentReviewIndex((prevIndex) => 
                  (prevIndex + 1) % reviews.length
                )}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Review Image Modal */}
      {selectedReview && (
        <ReviewImageModal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          imageUrl={selectedReview.image}
          caption={selectedReview.content}
        />
      )}
      <TopButton />
      {isFullScreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center cursor-zoom-in" 
          onClick={() => setIsFullScreen(false)}
          onMouseMove={handleFullScreenMouseMove}
        >
          <div className="relative">
            <Image
              src={product.imageUrl}
              alt={`나이키 에어포스 1 이미지`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            <div 
              className="absolute w-40 h-40 border-2 border-white pointer-events-none"
              style={{
                left: `${magnifiedPosition.x * 100}%`,
                top: `${magnifiedPosition.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${product.imageUrl})`,
                backgroundPosition: `${magnifiedPosition.x * 100}% ${magnifiedPosition.y * 100}%`,
                backgroundSize: '1200% 800%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>
      )}

      {/* 상세 이미지 전체화면 모달 */}
      {fullScreenDetailImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullScreenDetailImage(null)}
          onMouseMove={handleFullScreenMouseMove}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative" style={{ width: '90vh', height: '90vh' }}>
              <Image
                src={fullScreenDetailImage}
                alt="상세 이미지 전체화면"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vh"
                priority
              />
              <div
                className="absolute w-40 h-40 border-2 border-white pointer-events-none"
                style={{
                  left: `${magnifiedPosition.x * 100}%`,
                  top: `${magnifiedPosition.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${fullScreenDetailImage})`,
                  backgroundPosition: `${magnifiedPosition.x * 100}% ${magnifiedPosition.y * 100}%`,
                  backgroundSize: '1000%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

