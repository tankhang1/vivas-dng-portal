import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Layout } from "../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shared/components/ui";
import { Form } from "../../shared/components/ui/form";
import { FormInputField } from "../../shared/components/FormInputField";
import {
  useDashboardQuery,
  useEditDashboardProcessMutation,
} from "@/features/dashboard/hooks/dashboard.hook";
import { Info } from "lucide-react";

const generalInfoSchema = z.object({
  total_acreage: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số hợp lệ" })
    .min(0, "Giá trị không được âm"),
  satisfaction_index: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số hợp lệ" })
    .min(0, "Giá trị không được âm"),
  total_public_service: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số hợp lệ" })
    .min(0, "Giá trị không được âm"),
  total_citizen: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập số hợp lệ" })
    .min(0, "Giá trị không được âm"),
});

type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;

export default function GeneralSettingsPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardQuery();
  const editDashboardMutation = useEditDashboardProcessMutation();
  const [pendingValues, setPendingValues] =
    useState<GeneralInfoFormValues | null>(null);

  const form = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      total_acreage: 0,
      satisfaction_index: 0,
      total_public_service: 0,
      total_citizen: 0,
    },
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!dashboardData) return;
    reset({
      total_acreage: dashboardData.total_acreage,
      satisfaction_index: dashboardData.satisfaction_index,
      total_public_service: dashboardData.total_public_service,
      total_citizen: dashboardData.total_citizen,
    });
  }, [dashboardData, reset]);

  const executeSaveGeneralInfo = async (values: GeneralInfoFormValues) => {
    try {
      await editDashboardMutation.mutateAsync(values);
      window.alert("Cập nhật thông tin chung thành công.");
    } catch {
      window.alert("Cập nhật thông tin chung thất bại. Vui lòng thử lại.");
    }
  };

  const handleSaveGeneralInfo = (values: GeneralInfoFormValues) => {
    setPendingValues(values);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thông tin chung</h1>
          <p className="text-muted-foreground mt-1">
            Cập nhật các số liệu tổng quan hiển thị trên trang Tổng quan.
          </p>
        </div>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5 text-primary" />
              Số liệu tổng quan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleSaveGeneralInfo)}
                className="flex flex-col gap-4"
              >
                <FormInputField
                  control={control}
                  name="total_acreage"
                  label="Tổng diện tích (ha)"
                  required
                  inputProps={{ type: "number", disabled: isDashboardLoading }}
                />
                <FormInputField
                  control={control}
                  name="satisfaction_index"
                  label="Chỉ số hài lòng (%)"
                  required
                  inputProps={{ type: "number", disabled: isDashboardLoading }}
                />
                <FormInputField
                  control={control}
                  name="total_public_service"
                  label="Dịch vụ công"
                  required
                  inputProps={{ type: "number", disabled: isDashboardLoading }}
                />
                <FormInputField
                  control={control}
                  name="total_citizen"
                  label="Tổng công dân"
                  required
                  inputProps={{ type: "number", disabled: isDashboardLoading }}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={editDashboardMutation.isPending || isDashboardLoading}
                  >
                    {editDashboardMutation.isPending
                      ? "Đang lưu..."
                      : "Lưu thông tin"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={pendingValues !== null}
        onOpenChange={(open) => {
          if (!open && !editDashboardMutation.isPending) {
            setPendingValues(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận cập nhật thông tin chung?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn lưu các số liệu tổng quan mới không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingValues(null)}
            disabled={editDashboardMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!pendingValues) return;
              const values = pendingValues;
              setPendingValues(null);
              await executeSaveGeneralInfo(values);
            }}
            disabled={editDashboardMutation.isPending}
          >
            {editDashboardMutation.isPending ? "Đang lưu..." : "Xác nhận lưu"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
