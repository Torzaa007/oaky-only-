<script lang="ts">
	import type { PageData } from './$types';

	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import { route } from '$lib/ROUTES';
	import { MAX_NAME_LENGTH, RegisterUserZodSchema } from '$validations/RegisterUserZodSchema';

	import InputField from '$components/form/InputField.svelte';
	import SubmitButton from '$components/form/SubmitButton.svelte';

	export let data: PageData;

	const { enhance, errors, form, message } = superForm(data.registerUserFormData, {
		resetForm: true,
		taintedMessage: null,
		validators: RegisterUserZodSchema,

		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'success') {
				toast.success(alertText);
			}

			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});
</script>

<div class="flex justify-center items-center ">
	<div class="w-full max-w-md p-2 rounded-lg ">
		<h2 class="mb-6 text-2xl font-bold text-center text-gray-800">ลงทะเบียนเข้าสู่ระบบ</h2>
	  
		<!-- Single Form Start -->
		<form method="post" use:enhance class="space-y-6" action={route('registerUser /auth/register')}>
			<!-- InputField สำหรับอีเมล -->
			<InputField
				type="text"
				name="email"
				label="อีเมล / ชื่อผู้ใช้งาน"
				bind:value={$form.email}
				errorMessage={$errors.email}
				class="w-full"
			/>

			<!-- InputField สำหรับรหัสผ่าน -->
			<InputField
				type="password"
				name="password"
				label="รหัสผ่าน"
				bind:value={$form.password}
				errorMessage={$errors.password}
				class="w-full"
			/>

			<!-- InputField สำหรับยืนยันรหัสผ่าน -->
			<InputField
				type="password"
				name="confirmPassword"
				label="ยืนยันรหัสผ่าน"
				bind:value={$form.confirmPassword}
				errorMessage={$errors.confirmPassword}
				class="w-full"
			/>
	  
			<hr class="h-px my-8 bg-[#9F9F9F] border-0">
		  
			<p class="text-[#590606] underline font-medium">กรุณากรอกข้อมูลให้ครบถ้วน</p>
		  
			<!-- InputField สำหรับชื่อจริง -->
			<InputField
				type="text"
				name="firstname"
				placeholder="ชื่อจริง"
				bind:value={$form.firstname}
				errorMessage={$errors.firstname}
				class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
			/>

			<!-- InputField สำหรับนามสกุล -->
			<InputField
				type="text"
				name="lastname"
				placeholder="นามสกุล"
				bind:value={$form.lastname}
				errorMessage={$errors.lastname}
				class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
			/>

			<!-- InputField สำหรับเบอร์โทรศัพท์ -->
			<InputField
				type="tel"
				name="phonenumber"
				placeholder="เบอร์โทรศัพท์"
				bind:value={$form.phonenumber}
				errorMessage={$errors.phonenumber}
				class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
			/>

			<!-- InputField สำหรับเลขบัตรประจำตัวประชาชน -->
			<InputField
				type="text"
				name="personal_id"
				placeholder="เลขบัตรประจำตัวประชาชน"
				bind:value={$form.personal_id}
				errorMessage={$errors.personal_id}
				class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
			/>
		  
			<!-- Submit Button -->
			<SubmitButton class="w-full bg-[#102C57] text-white rounded-lg py-3 px-4 hover:bg-[#1a3f7a] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#102C57] focus:ring-opacity-50">
				ยืนยันการสมัคร
			</SubmitButton>
		</form>
		<!-- Single Form End -->
	</div>
</div>
