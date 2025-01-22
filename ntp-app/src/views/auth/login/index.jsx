import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import {useMutation} from "@tanstack/react-query";
import request from "@/helpers/request.js";
import {URLs} from "@/helpers/url.js";
import {useCallback} from "react";
import useUserInfoStore from "@/stores/useUserInfoStore.js";

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const { login } = useUserInfoStore()
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { mutate } = useMutation({
    mutationFn: (params) =>
      request(URLs.AUTH.LOGIN, {
        verb: 'post',
        params,
      }),
    onSuccess: (data) => {
      login(data?.data);
    },
  });

  const onSubmit = useCallback( (data) => {
    setIsLoading(true)
    try {
      mutate(data);
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để truy cập hệ thống
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-left">
            <Label htmlFor="username">
              Tên đăng nhập
            </Label>
            <Input
              id="username"
              type="text"
              {...register("username", { required: "Vui lòng nhập tên đăng nhập" })}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="password">
              Mật khẩu
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => navigate("/auth/forgot-password")}
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage 