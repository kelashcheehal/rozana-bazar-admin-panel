"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ProductDetailsAccordion({ product }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Product Details */}
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.materials && product.materials.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Materials</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-50 text-gray-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Shipping Details */}
      <AccordionItem value="item-2">
        <AccordionTrigger>Care Instructions</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>{product.care_instructions}</p>
        </AccordionContent>
      </AccordionItem>

      {/* Return Policy */}
      <AccordionItem value="item-3">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent className="flex flex-col text-balance">
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>
          <p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
        </AccordionContent>
      </AccordionItem>
      {/* Return Policy */}
      <AccordionItem value="item-4">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent className="flex flex-col text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
