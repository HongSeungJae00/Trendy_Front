'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginFailurePage() {
  const router = useRouter()

  useEffect(() => {
    // 3초 후 로그인 페이지로 자동 이동
    const timer = setTimeout(() => {
      router.push('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">로그인 실패</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          로그인 도중 문제가 발생했습니다.
        </p>
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="font-medium text-red-600 hover:text-red-500"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
} 