import { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { X } from 'lucide-react'

interface ReviewPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (review: { text: string, image: File | null }) => void
}

export function ReviewPopup({ isOpen, onClose, onSubmit }: ReviewPopupProps) {
  const [reviewText, setReviewText] = useState('')
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (validTypes.includes(file.type)) {
        setReviewImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert('JPEG/JPG, PNG, GIF 파일만 업로드 가능합니다.');
      }
    }
  }

  const handleSubmit = () => {
    onSubmit({ text: reviewText, image: reviewImage });
    setReviewText('');
    setReviewImage(null);
    setPreviewUrl(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">리뷰 작성하기</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-2">사진 업로드</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
              onClick={() => document.getElementById('review-image')?.click()}
            >
              {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  width={200} 
                  height={200} 
                  className="mx-auto rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p>클릭하여 JPEG/JPG, PNG, GIF 이미지를 업로드하세요</p>
                </div>
              )}
              <input
                id="review-image"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <Label className="text-base mb-2">리뷰 내용</Label>
            <div className="relative">
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="리뷰를 작성해주세요."
                className="min-h-[100px]"
                maxLength={100}
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                {reviewText.length}/100
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
          >
            제출하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

