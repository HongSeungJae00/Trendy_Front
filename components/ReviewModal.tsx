import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

interface ReviewModalProps {
isOpen: boolean
onClose: () => void
onSubmit: (review: { text: string, image: File | null }) => void
}

export function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
const [reviewText, setReviewText] = useState('')
const [reviewImage, setReviewImage] = useState<File | null>(null)
const [previewUrl, setPreviewUrl] = useState<string | null>(null)

const confirmClose = () => {
  if (reviewText || reviewImage) {
    return window.confirm("모든 내용이 삭제됩니다. 그래도 취소하시겠습니까?");
  }
  return true;
};

useEffect(() => {
  if (isOpen) {
    setReviewText('');
    setReviewImage(null);
    setPreviewUrl(null);
  }
}, [isOpen]);

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
};

const handleSubmit = () => {
  onSubmit({ text: reviewText, image: reviewImage })
  onClose()
}

return (
  <Dialog open={isOpen} onOpenChange={(open) => {
    if (!open && confirmClose()) {
      onClose();
    }
  }}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>리뷰 작성하기</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid w-full items-center gap-1.5" onClick={() => document.getElementById('review-image')?.click()}>
          <Label htmlFor="review-image">사진 업로드</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" width={200} height={200} className="rounded-md mx-auto" />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1 text-sm text-gray-600">클릭하여 JPEG/JPG, PNG, GIF 이미지를 업로드하세요</p>
              </div>
            )}
            <Input id="review-image" type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleImageChange} className="hidden" />
          </div>
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="review-text">리뷰 내용</Label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="리뷰를 작성해주세요."
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">제출하기</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
}

