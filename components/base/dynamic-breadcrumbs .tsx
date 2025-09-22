"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBreadcrumbLabel } from "@/lib/utils";

const DynamicBreadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          if (segment === "show") return;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const parentKey = pathSegments[index - 1];
          const isLast = index === pathSegments.length - 1;
          const label = getBreadcrumbLabel(segment);
          const isNumber = /^\d+$/.test(segment);

          if (isNumber && isLast) {
            return (
              <div key={href} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbPage>
                  {parentKey === "show" ? "عرض" : "تعديل"}
                </BreadcrumbPage>
              </div>
            );
          }

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
