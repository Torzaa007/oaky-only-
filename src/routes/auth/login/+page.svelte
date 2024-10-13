<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	import { UserLoginZodSchema } from '$validations/UserLoginZodSchema';

	import InputField from '$components/form/InputField.svelte';
	import SubmitButton from '$components/form/SubmitButton.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	const { enhance, form, errors, message } = superForm(data.userLoginFormData, {
		resetForm: true,
		taintedMessage: null,
		validators: UserLoginZodSchema,

		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			if (alertType === 'error') {
				toast.error(alertText);
			}
		}
	});
</script>

<div class="mx-20 sm:mx-28 md:mx-40 lg:mx-60 xl:mx-[34rem] mt-10 space-y-10">
    <div class="flex justify-center items-center">
        <p class="font-bold text-2xl sm:text-3xl md:text-4xl underline">เข้าสู่ระบบ</p>
    </div>

    <form method="post" use:enhance class="space-y-6">
        <InputField
            type="email"
            name="email"
            label="อีเมล / ชื่อผู้ใช้งาน"
            bind:value={$form.email}
            errorMessage={$errors.email}
			class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
			/>

        <InputField
            type="password"
            name="password"
            label="รหัสผ่าน"
            bind:value={$form.password}
            errorMessage={$errors.password}
            class="border-2 border-[#9F9F9F] rounded-lg w-full py-3 sm:py-4 md:py-5 p-4 sm:p-5 md:p-6 text-gray-500 text-left focus:outline-none focus:ring-2 focus:ring-gray-300 "
        />
        <SubmitButton
            class="bg-[#102C57] text-white rounded-lg"
        />
    </form>
</div>
