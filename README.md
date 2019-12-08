# Cara Instalasi 

clone project dengan cara berikut ini: (dengan terminal pada ubuntu)

pilih direktori untuk tempat penyimpanan file
lalu klik kanan dan buka terminal dengan klik "Open in Terminal"
lalu ketik 

`git clone https://github.com/didi-stwn/Xirka-ServerBaru.git`

lalu terminal akan secara otomatis mendownload file yang ada di GitHub
setelah file selesai diClone, masuk ke direktori folder yang baru di download 

`cd Xirka-ServerBaru`

atau close terminal lalu buka folder `Xirka-ServerBaru` yang berhasil dibuat tadi

setelah proses clone selesai, sekarang proses install

ketik 

`sudo npm install` 

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/npminstall.png)

untuk menginstall node_modules, tunggu beberapa saat hingga proses selesai.

lalu ketik 

`npm start` 

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/npm%20start.png)

untuk memulai memasang pada server

lalu akan ditemukan error sebagai berikut:

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/errorods.png)

lalu buka folder tempat error berada `./node_modules/tempa-xlsx/`

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/odsjs.png)

kemudian hapus isi file `ods.js` atau buat file document baru bernama `ods.js` sehingga isi dari `ods.js` kosong seperti dibawah ini

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/filekosong.png)

kemudian balik ke direktori 

`./Xirka-ServerBaru`

lalu ketik 

`npm start`

lalu tunggu beberapa saat dan buka browser lalu buka buka localhost:8080 atau ip berdasarkan PCnya



# Cara Build

jika perintah `npm start ` dapat berjalan dengan baik, maka langkah berikutnya adalah build project yang kemudian akan dipasang di webservernya

pertama, buka direktori tempat clone berada lalu ketik

`sudo npm run build`

tunggu hingga proses selesai. setelah selesai akan terbentuk folder baru bernama `build`

file build sudah selesai dibuat, kemudian langkah berikutnya disesuaikan dengan web browser yang diinginkan seperti nginx, apache dan sebagainya

### untuk nginx sourcenya sebagai berikut 

buka direktori `/etc/nginx/sites-available` lalu buat file baru (namanya bebas) dan isinya sebagai berikut 

```
server {
  listen 80;
  root /home/xirka/server_magang/Xirka-ServerBaru/build     //tempat direktori build berada
  server_name [domain.com];
  index index.html index.htm;
  location / {
    try_files $uri /index.html
  }
}
```

lalu link ke sites-enable dengan perintah

`sudo ln -s /etc/nginx/sites-available/[namafile] /etc/nginx/sites-enabled/`

lalu restart nginx dengan perintah 

`sudo service nginx restart`



# Dokumentasi Penggunaan React JS

Berikut beberapa hal yang diperlukan untuk dapat mengcode React JS

1. Install Node JS dengan perintah `sudo apt-get update` lalu `sudo apt-get install nodejs`

2. Lalu cek versi nodejs dan npmnya dengan perintah `node -v` dan `npm -v`

3. Jika npm dan node sudah terinstall  maka langsung dapat membuat app reactnya, sebelumnya untuk mengupdate npm dapat dilakukan perintah `npm install npm@latest -g`

4. Berikutnya membuat file baru react

5. Pilih direktori buat tempat penyimpanan folder app react

6. kemudian jalankan perintah `npm create-react-app [nama folder]`

7. setelah proses instalasi selesai masuk ke dalam folder reactnya dengan perintah `cd [nama folder]`

8. lalu ketik perintah `npm start` untuk memulai programnya lalu akan muncul secara otomatis di browser dengan link `localhost:3000`

9. untuk membuildnya dapat dilakukan perintah `sudo npm run build`

10. untuk mengubah port dapat dilakukan pengeditan pada file package.json pada bagian scriptnya dengan menambahkan PORT=[port yang diinginkan] pada start, berikut untuk port 8000

```
"scripts": {
    "start": "PORT=8000 react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  ```


Berikut beberapa komponen penting dalam react

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/Untitled%20Diagram%20(3).png)

ada 3 penting file dalam react yaitu index.html, App.js, dan index.js

jadi index.html itu yang ditampilkan pada browser, isinya dari App.js yang dihubungkan dengan index.js, jadi jika dideploy pada browser, kode pada App.js tidak akan terlihat.


![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/index.html.png)

Ini isi index.html, jadi dia ada div dengan id root, dimana id root ini akan di link ke app.js dengan index.js


berikut isi index.jsnya

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/index.js.png)

maksud ReactDOM.render yaitu menjalankan App dari app.js yang dimasukan ke id root yang ada di index.htmlnya


salah 1 keunggulan react yaitu dapat terdiri dari beberapa komponent, pada kasus ini saya buat 3 komponent yang digambar berikut

![alt text](https://github.com/didi-stwn/Xirka-FrontEnd/blob/master/screenshoot/Untitled%20Diagram.png)

jadi saya banyak edit di bagian contentnya, cara buatnya yaitu memanggil menu, header, content pada App.js

dimana pada file saya komponent 3 itu (menu, header, dan content) ada didalam file ./src/component

dan isi contentnya ada didalam ./src/component/content

untuk route dan transition routenya saya menggunakan module dari react-router-dom, dapat dicari pada link berikut: https://www.npmjs.com/package/react-router-dom dan transitionnya pada link: https://www.npmjs.com/package/react-router-transition.

Didalam kodenya saya menggunakan lifecycle pada react yaitu Componentdidmount yang berfungsi untuk menjalankan perintah yang ada didalamnya saat pertamakali komponent dibuka, kemudian untuk algoritma saya masukan didalam render dan direturn saya tampilkan hasilnya dalam bahasa html.
