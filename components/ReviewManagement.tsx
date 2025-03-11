'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface ReviewImage {
  id: number
  src: string
  description: string
  selected?: boolean
}

export function ReviewManagement() {
  const [images, setImages] = useState<ReviewImage[]>(
    Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      src: `/placeholder.svg?height=200&width=200`,
      description: `리뷰 #${index + 1}에 대한 상세 설명이 여기에 들어갑니다.`,
      selected: false
    }))
  )
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ReviewImage | null>(null)
  const [isDeleteSelectedDialogOpen, setIsDeleteSelectedDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedImage, setEditedImage] = useState<ReviewImage | null>(null)

  const deleteImage = (id: number) => {
    setImages(images.filter(image => image.id !== id))
    setDeleteImageId(null)
  }

  const toggleImageSelection = (id: number) => {
    setImages(images.map(image => 
      image.id === id ? { ...image, selected: !image.selected } : image
    ))
  }

  const deleteSelectedImages = () => {
    setImages(images.filter(image => !image.selected))
    setIsDeleteSelectedDialogOpen(false)
  }

  const deleteAllImages = () => {
    setImages([])
    setIsDeleteAllDialogOpen(false)
  }

  const handleEdit = () => {
    setIsEditing(true);
    if (selectedImage) {
      setEditedImage(selectedImage);
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === selectedImage.id ? { ...selectedImage } : img
        )
      );
    }
  };

  const handleSave = () => {
    if (editedImage) {
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === editedImage.id ? editedImage : img
        )
      );
      setSelectedImage(editedImage);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false)
    setEditedImage(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setEditedImage(prev => prev ? {...prev, src: result} : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden relative">
            <button 
              className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100/50 transition-colors"
              onClick={() => setDeleteImageId(image.id)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <img
              src={image.src}
              alt={`리뷰 이미지 ${image.id}`}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
            <CardContent className="p-3 flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate" title={image.description}>
                {image.description.length > 8 ? `${image.description.slice(0, 8)}...` : image.description}
              </p>
              <Checkbox
                checked={image.selected}
                onCheckedChange={() => toggleImageSelection(image.id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => setIsDeleteSelectedDialogOpen(true)}>선택 삭제</Button>
        <Button variant="destructive" onClick={() => setIsDeleteAllDialogOpen(true)}>전체 삭제</Button>
      </div>

      <AlertDialog open={deleteImageId !== null} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 리뷰가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteImageId && deleteImage(deleteImageId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>모든 리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 모든 리뷰가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={deleteAllImages}
            >
              전체 삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteSelectedDialogOpen} onOpenChange={setIsDeleteSelectedDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>선택한 리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택한 리뷰가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={deleteSelectedImages}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={selectedImage !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedImage(null);
          setIsEditing(false);
          setEditedImage(null);
          setImages(prevImages => [...prevImages]);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>리뷰 이미지</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>리뷰 #{selectedImage?.id}</p>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                  파일 선택
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isEditing ? (
              <>
                <Input
                  value={editedImage?.src}
                  onChange={(e) => setEditedImage(prev => prev ? {...prev, src: e.target.value} : null)}
                  placeholder="이미지 URL"
                  className="mb-4"
                />
                <Textarea
                  value={editedImage?.description}
                  onChange={(e) => setEditedImage(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="리뷰 설명"
                  className="mb-4"
                />
              </>
            ) : (
              <>
                <img
                  src={selectedImage?.src}
                  alt={`리뷰 이미지 ${selectedImage?.id}`}
                  className="w-full h-auto object-cover"
                />
                <p className="mt-2 text-sm text-gray-600">
                  {selectedImage?.description}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>취소</Button>
                <Button onClick={handleSave} className="bg-red-500 hover:bg-red-700 text-white">저장</Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEdit} className="bg-red-500 hover:bg-red-700 text-white border-red-500">
                수정하기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

