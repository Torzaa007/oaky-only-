<script lang="ts">
  import { onMount } from 'svelte';
  import { redirect } from '@sveltejs/kit';

  let paymentId: string | null = '';
  let totalPrice: string | null;

  onMount(() => {
    paymentId = sessionStorage.getItem('paymentId') || '';
    totalPrice = sessionStorage.getItem('totalPrice');
    console.log("Payment ID from sessionStorage:", paymentId);
  });

  let email = '';
  let firstName = '';
  let lastName = '';
  let cardNumber = '';
  let expiryDate = '';
  let cvc = '';
  let selectedPaymentMethod = ''; 
  let countdown = 300;
  let countdownInterval: NodeJS.Timeout;

  $: if (selectedPaymentMethod === 'PromptPay' && !countdownInterval) {
    startCountdown();
  }

  function startCountdown() {
    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        // Handle timeout case
      }
    }, 1000);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')} | ${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async function submitPayment(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        form.action, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Use goto for client-side navigation
        throw redirect(
			route('/ticket')
		  );      
      } else {
        console.error(result.message);
        // Handle the failure case (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      // Handle network errors or other exceptions
    }
  }
</script>
<!-- HTML Section -->
<div class="mb-2">
  {#if paymentId}
    <p>รหัสการชำระเงิน: {paymentId}</p>
  {:else}
    <p>ไม่พบรหัสการชำระเงิน</p>
  {/if}
</div>

<div class="w-full md:w-1/2">
  {#if paymentId}
    <div class="flex flex-col md:flex-row md:justify-between items-center p-8 mb-2">
      <!-- Payment Form Section -->
      <div class="w-full md:w-1/2">
        <form method="POST" action="?/simulatePayment">
          <input type="hidden" name="reserved_seat_id" value={paymentId} />
          <input type="hidden" name="payment_id" value={paymentId} />
          
          <div class="mb-2">
            <label for="payment-method" class="block mb-2 text-[#102C57] font-extrabold text-xl">เลือกวิธีการชำระเงิน</label>
            <div class="border border-[#9F9F9F] rounded-lg p-2 flex justify-between">
              <select id="payment-method" name="payment_method" class="w-full focus:outline-none text-[#9F9F9F]" bind:value={selectedPaymentMethod}>
                <option value="">-- กรุณาเลือกวิธีการชำระเงิน --</option>
                <option value="PromptPay">QR พร้อมเพย์</option>
                <option value="MasterCard">บัตรเครดิต/เดบิต</option>
              </select>
            </div>
          </div>
          
          {#if selectedPaymentMethod}
            <div class="border-t border-black my-4"></div>
    
            {#if selectedPaymentMethod === 'PromptPay'}
              <!-- PromptPay section -->
              <div class="mb-4">
                <p class="block mb-2 text-[#102C57] font-extrabold text-xl">ช่องทางชำระเงินด้วย PromptPay</p>
                <div class="flex flex-col justify-normal items-center">
                  <img src="https://www.theodoostore.com/web/image/app/10392/app_icon" alt="PromptPay QR" />    
                </div>
                <div class="flex flex-col justify-normal items-center">
                  <p class="text-3xl font-bold text-[#590606]">ชำระภายใน: {formatTime(countdown)}</p>
                </div>
              </div>
            {:else if selectedPaymentMethod === 'MasterCard'}
              <!-- Credit/Debit section -->
              <div class="mb-4">
                <p class="block mb-2 text-[#102C57] font-extrabold text-xl">ข้อมูลส่วนบุคคล</p>
                <div class="border-2 border-dashed border-[#9747FF] rounded-lg p-4">
                  <!-- Email -->
                  <div class="mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="อีเมล"
                      class="w-full p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={email}
                      required
                    />
                  </div>
      
                  <!-- Name -->
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="ชื่อจริง"
                      class="p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={firstName}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="นามสกุล"
                      class="p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={lastName}
                      required
                    />
                  </div>
      
                  <!-- Card Number -->
                  <div class="mb-3">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="หมายเลขบัตร"
                      class="w-full p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={cardNumber}
                      required
                    />
                  </div>
      
                  <!-- Expiry Date and CVC -->
                  <div class="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="วันหมดอายุ"
                      class="p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={expiryDate}
                      required
                    />
                    <input
                      type="text"
                      name="cvc"
                      placeholder="CVC / หมายเลขหลังบัตร"
                      class="p-2 border border-[#9F9F9F] rounded-lg focus:outline-none"
                      bind:value={cvc}
                      required
                    />
                  </div>
                </div>
              </div>
            {/if}
    
            <!-- Payment Button -->
            <div class="text-right">
              <button type="submit" class="bg-[#102C57] text-white py-2 px-4 rounded-lg">
                ชำระเงิน
              </button>
            </div>
          {/if}
        </form>
      </div>
    
      <!-- Image and Text Section -->
      <div class="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
        <div class="flex flex-col justify-center items-center mx-8 space-y-8">
          <h2 class="text-[#102C57] text-3xl font-black mb-4 underline">คุณเตรียมตัวเดินทาง เราจะพาคุณไปถึงจุดหมาย</h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/235/235861.png"
            alt="Map Icon"
            class="w-40 h-40"
          />
        </div>
      </div>
    </div>
  {:else}
    <p>ไม่พบ Payment ID</p>
  {/if}
</div> 
