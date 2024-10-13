
<script>
  export let data;
 import { formatDateTime, formatSeatType } from '$lib/utils.js';
 import QRCode from 'qrcode';
 import html2canvas from 'html2canvas';
 
 let tickets = [];
 if (data.tickets) {
   tickets = data.tickets;
 }
 
 // ฟังก์ชันสำหรับจัดรูปแบบข้อมูลตั๋ว
 function getFormattedTicket(ticket) {
   return {
     name: `${ticket.firstname} ${ticket.lastname}`,
     phonenumber: ticket.phonenumber,
     date: formatDateTime(ticket.from_datetime).date,
     time: formatDateTime(ticket.from_datetime).time,
     seat_type: formatSeatType(ticket.seat_type),
     passenger_trip: ticket.trip_id,
     from_station_name: ticket.from_station_name,
     to_station_name: ticket.to_station_name,
     seat: ticket.seat_id,
     train: ticket.train_id,
     passenger_id: ticket.passenger_id,
   };
 }
 
 // ฟังก์ชันสำหรับสร้าง QR code
 async function generateQRCode(ticket) {
   const qrData = JSON.stringify({
     passenger_id: ticket.passenger_id,
     check: ticket.train,
     reserve_id: ticket.reserve_id,
     reserve_status: ticket.reserve_status
   });
   
   try {
     const qrCodeDataUrl = await QRCode.toDataURL(qrData);
     return qrCodeDataUrl;
   } catch (err) {
     console.error('Error generating QR code:', err);
     return null;
   }
 }
 
 // ฟังก์ชันสำหรับบันทึกรูปภาพ
 async function saveAsImage() {
   const element = document.getElementById('contentToSave');
   try {
     const canvas = await html2canvas(element);
     const image = canvas.toDataURL('image/png');
     const link = document.createElement('a');
     link.href = image;
     link.download = 'train_ticket.png';
     link.click();
   } catch (err) {
     console.error('Error saving image:', err);
   }
 }
 </script>
 
 <div class="container mx-auto mt-8" id="contentToSave">
   <p class="text-center text-2xl font-bold text-blue-900 mb-6">
     ตั๋วโดยสารอิเล็กทรอนิกส์ <br>
     <span class="text-lg text-black">
       นี่คือตั๋วโดยสารอิเล็กทรอนิกส์ของท่าน โปรดเก็บไว้จนกว่าจะถึงวันเดินทางและให้พนักงานตรวจตั๋วโดยสารตรวจตั๋วของท่าน
     </span>
   </p>
   {#each tickets as ticket, index}
     <div class="ticket-section mb-8" style="border: 1px solid #ccc; padding: 16px; border-radius: 8px;">
       <div style="background-color: #DAC0A3;" class="p-4">
         <div class="flex justify-between items-center">
           <h1 class="text-2xl font-bold text-blue-900 p-4">OURTRAIN TICKETS #{index + 1}</h1>
         </div>
       </div>
       <div style="background-color: #EADBC8;" class="p-4">
         <div class="grid sm:grid-cols-3 mb-1">
           <p class="text-lg font-normal p-6">ชื่อ-นามสกุล {getFormattedTicket(ticket).name}</p>
           <p class="text-lg font-normal p-7 col-span-2">เบอร์โทรศัพท์ {getFormattedTicket(ticket).phonenumber}</p>
         </div>
         <div class="grid sm:grid-cols-3 mb-6 gap-4">
           <div class="text-lg font-normal p-6">เที่ยวโดยสาร {getFormattedTicket(ticket).passenger_trip}</div>
           <div class="text-lg font-normal p-6">วันที่เดินทาง {getFormattedTicket(ticket).date}</div>
           <div class="text-lg font-normal p-6">เวลาที่ออก {getFormattedTicket(ticket).time}</div>
         </div>
         <div class="border-t border-black mx-6"></div>
         <div class="grid sm:grid-cols-2 mb-6 gap-4">
           <div class="text-lg font-normal p-6">
             <p class="mb-20">สถานีต้นทาง {getFormattedTicket(ticket).from_station_name}</p>
             <p>สถานีปลายทาง {getFormattedTicket(ticket).to_station_name}</p>
           </div>
           <div class="text-lg font-normal p-6">
             <p class="mb-7">ที่นั่ง {getFormattedTicket(ticket).seat}</p>
             <p class="mb-7">ขบวนที่ {getFormattedTicket(ticket).train}</p>
             <p>ชั้นโดยสาร {getFormattedTicket(ticket).seat_type}</p>
           </div>
         </div>
         <div class="border-t border-black mx-6 mb-6"></div>
         <!-- QR Code and Ticket Info -->
         <div class="flex justify-center items-center flex-col">
           {#await generateQRCode(getFormattedTicket(ticket))}
             <p>กำลังสร้าง QR Code...</p>
           {:then qrCodeDataUrl}
             {#if qrCodeDataUrl}
               <img src={qrCodeDataUrl} alt="QR Code" width="200" height="200">
               <div class="mt-4 text-center">
                 <p class="font-bold">ข้อมูลที่ถูกเข้ารหัสใน QR Code:</p>
                 <p>Passenger ID: {getFormattedTicket(ticket).passenger_id}</p>
                 <p>Reserve ID: {getFormattedTicket(ticket).seat}</p>
                 <p>Reserve Status: {getFormattedTicket(ticket).reserve_status}</p>
               </div>
             {:else}
               <p>ไม่สามารถสร้าง QR Code ได้</p>
             {/if}
           {:catch error}
             <p>เกิดข้อผิดพลาดในการสร้าง QR Code: {error.message}</p>
           {/await}
         </div>
       </div>
     </div>
   {/each}
 </div>
 
 <div class="flex justify-center">
   <button
     on:click={saveAsImage}
     class="rounded-lg mt-6 bg-indigo-600 w-32 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-2 mt-2 text-center block"
   >
     บันทึกรูปภาพ
   </button>
 </div>
 
 {#if data.error}
   <div class="container mx-auto mt-8">
     <p class="text-center text-red-500">{data.error}</p>
   </div>
 {/if}
