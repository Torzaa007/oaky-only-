import Root from './button.svelte';
import { tv, type VariantProps } from 'tailwind-variants';
import type { Button as ButtonPrimitive } from 'bits-ui';

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
	  variant: {
		default: 'text-white',  // ปรับสีพื้นหลังเป็นฟ้า
		destructive: 'bg-red-500 text-white hover:bg-red-700',  // ปรับสีแดงสำหรับ destructive
		outline: 'bg-transparent',
		secondary: 'bg-green-500 text-white hover:bg-green-600',  // ปรับสีเขียวสำหรับ secondary
		ghost: 'text-red',
		link: 'text-blue-500 underline-offset-4 hover:underline'
	  },
	  size: {
		default: 'h-10 px-4 py-2 rounded-lg',  // ใช้ rounded-lg
		sm: 'h-9 rounded-md px-3',  // ใช้ rounded-md สำหรับขนาดเล็ก
		lg: 'h-12 px-8 rounded-2xl',  // ใช้ rounded-2xl สำหรับขนาดใหญ่
		icon: 'h-10 w-10 rounded-full'  // กลมเต็มสำหรับไอคอน
	  }
	},
	defaultVariants: {
	  variant: 'default',
	  size: 'default'
	}
  });
  

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants
};
