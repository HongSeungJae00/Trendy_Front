'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signUpSchema = z.object({
  username: z.string()
    .min(3, '아이디는 3자 이상이어야 합니다')
    .max(20, '아이디는 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9_-]+$/, '아이디는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(50, '비밀번호는 50자 이하여야 합니다')
    .regex(/[A-Z]/, '비밀번호는 최소 1개의 대문자를 포함해야 합니다')
    .regex(/[a-z]/, '비밀번호는 최소 1개의 소문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호는 최소 1개의 숫자를 포함해야 합니다')
    .regex(/[^A-Za-z0-9]/, '비밀번호는 최소 1개의 특수문자를 포함해야 합니다'),
  confirmPassword: z.string(),
  email: z.string()
    .email('유효한 이메일 주소를 입력해주세요')
    .min(1, '이메일은 필수 입력값입니다'),
  verificationCode: z.string()
    .min(6, '인증번호 6자리를 입력해주세요')
    .max(6, '인증번호는 6자리여야 합니다')
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호와 비밀번호 확인이 일치하지 않습니다",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      verificationCode: '',
    },
  });

  // API 요청 함수
  const fetchAPI = async (url: string, options: RequestInit) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        credentials: 'include',  // 쿠키 포함
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '요청에 실패했습니다.');
    }
    return response.json();
  };

  // 상태 초기화 함수
  const resetStates = () => {
    setUsernameMessage(null);
    setEmailMessage(null);
    setIsCheckingUsername(false);
    setIsCheckingEmail(false);
  };

  // 아이디 중복 확인 API
  const checkUsername = async (username: string) => {
    if (!username || username.trim().length === 0) {
      setUsernameMessage('아이디를 입력해주세요.');
      return;
    }

    // 아이디 유효성 검사
    if (username.length < 3 || username.length > 20) {
      setUsernameMessage('아이디는 3자 이상 20자 이하여야 합니다.');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameMessage('아이디는 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.');
      return;
    }

    setIsCheckingUsername(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const result = await fetchAPI(`${apiUrl}/api/signup/check-username?username=${encodeURIComponent(username)}`, { method: 'GET' });
      setUsernameMessage(result.message);
    } catch (error: any) {
      setUsernameMessage(error.message);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 이메일 인증번호 확인
  const verifyCode = async (email: string, code: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/mailCheck?userNumber=${code}&mail=${email}`);
      const result = await response.json();
      
      if (result.success) {
        setEmailMessage(result.message);
        setIsEmailVerified(true);
      } else {
        setEmailMessage(result.message);
        setIsEmailVerified(false);
      }
    } catch (error: any) {
      setEmailMessage('인증번호 확인 중 오류가 발생했습니다.');
      setIsEmailVerified(false);
    }
  };

  // 이메일 인증 API
  const verifyEmail = async (email: string) => {
    if (!email || email.trim().length === 0) {
      setEmailMessage('이메일을 입력해주세요.');
      return;
    }

    setIsCheckingEmail(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `mail=${encodeURIComponent(email)}`,
      });
      
      const result = await response.json();
      if (result.success) {
        setEmailMessage(result.message);
        setShowVerificationInput(true);
      } else {
        setEmailMessage(result.message);
      }
    } catch (error: any) {
      setEmailMessage('이메일 발송 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 회원가입 처리 API
  async function onSubmit(data: SignUpForm) {
    setSignupError(null); // 에러 메시지 초기화

    if (!isEmailVerified) {
      setSignupError('이메일 인증을 완료해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const result = await fetchAPI(`${apiUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email
        }),
      });
      
      if (result.status === 'success') {
        alert('회원가입이 완료되었습니다!');
        form.reset();
        resetStates();
      } else {
        setSignupError(result.message);
      }
    } catch (error: any) {
      setSignupError(error.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
      {signupError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {signupError}
          </p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 아이디 입력 */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">아이디</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="아이디를 입력하세요"
                        {...field}
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => checkUsername(field.value)}
                        disabled={isCheckingUsername || !field.value || field.value.length < 3}
                      >
                        {isCheckingUsername ? '확인 중...' : '중복 확인'}
                      </Button>
                    </div>
                  </FormControl>
                  {usernameMessage && (
                    <p className={`text-sm ${
                      usernameMessage.includes('사용 가능한') 
                        ? 'text-green-600' 
                        : 'text-red-500'
                    }`}>
                      {usernameMessage}
                    </p>
                  )}
                  <div className="text-sm text-gray-500">
                    • 3-20자의 영문, 숫자, 특수문자(-_)만 사용 가능
                  </div>
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
            )}
          />

          {/* 비밀번호 입력 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">비밀번호</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                  </FormControl>
                  <div className="text-sm text-gray-500">
                    • 8자 이상 50자 이하
                    <br />
                    • 대문자, 소문자, 숫자, 특수문자 각각 1개 이상 포함
                  </div>
                  <FormMessage className="text-red-500" />
                </div>
              </FormItem>
            )}
          />

          {/* 비밀번호 확인 */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">비밀번호 확인</FormLabel>
                <div className="space-y-1">
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="비밀번호를 다시 입력하세요" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const password = form.getValues('password');
                        const confirmPassword = e.target.value;
                        if (confirmPassword) {
                          if (password === confirmPassword) {
                            form.clearErrors('confirmPassword');
                          } else {
                            form.setError('confirmPassword', {
                              type: 'manual',
                              message: '비밀번호가 일치하지 않습니다'
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <p className={`text-sm ${
                      field.value === form.getValues('password')
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}>
                      {field.value === form.getValues('password')
                        ? '✓ 비밀번호가 일치합니다'
                        : '✗ 비밀번호가 일치하지 않습니다'}
                    </p>
                  )}
                </div>
              </FormItem>
            )}
          />

          {/* 이메일 입력 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">이메일</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="이메일을 입력하세요"
                      {...field}
                      onChange={(e) => {
                        resetStates();
                        setShowVerificationInput(false);
                        setIsEmailVerified(false);
                        field.onChange(e);
                      }}
                      className="flex-grow"
                      disabled={isEmailVerified}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`${
                        isEmailVerified 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white`}
                      onClick={() => verifyEmail(field.value)}
                      disabled={isCheckingEmail || isEmailVerified}
                    >
                      {isCheckingEmail ? '발송 중...' : isEmailVerified ? '인증완료' : '인증번호 발송'}
                    </Button>
                  </div>
                </FormControl>
                {emailMessage && (
                  <p className={`text-sm mt-1 ${isEmailVerified ? 'text-green-600' : 'text-gray-600'}`}>
                    {emailMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 인증번호 입력 */}
          {showVerificationInput && !isEmailVerified && (
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">인증번호</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="인증번호 6자리를 입력하세요"
                        maxLength={6}
                        {...field}
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => verifyCode(form.getValues('email'), field.value)}
                      >
                        확인
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className={`w-full ${
              isSubmitting 
                ? 'bg-gray-400'
                : signupError 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            disabled={isSubmitting || !form.formState.isValid || !isEmailVerified}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">처리 중...</span>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : '회원가입'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
