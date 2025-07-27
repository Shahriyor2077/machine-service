-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_creator" BOOLEAN NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regional" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "jails_number" TEXT NOT NULL,
    "vn_number" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "current_owner_id" INTEGER NOT NULL,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_history" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "buyout_id" INTEGER NOT NULL,
    "sold_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firm_workers" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "firm_workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firm_services" (
    "id" SERIAL NOT NULL,
    "firm_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "firmWorkersId" INTEGER,

    CONSTRAINT "firm_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_accident" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "damage_level" TEXT NOT NULL,
    "is_repaired" BOOLEAN NOT NULL DEFAULT false,
    "service_id" INTEGER,

    CONSTRAINT "car_accident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activationLink" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "firmid" INTEGER NOT NULL,

    CONSTRAINT "worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services_for_car" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "firm_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT,
    "mileage" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "services_for_car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_item" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "the" TEXT,
    "part_used" TEXT,
    "cost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "service_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "firm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "firm_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "firm_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DistrictToRegion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DistrictToRegion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DistrictToRegion_B_index" ON "_DistrictToRegion"("B");

-- AddForeignKey
ALTER TABLE "car_history" ADD CONSTRAINT "car_history_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm_workers" ADD CONSTRAINT "firm_workers_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm_services" ADD CONSTRAINT "firm_services_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm_services" ADD CONSTRAINT "firm_services_firmWorkersId_fkey" FOREIGN KEY ("firmWorkersId") REFERENCES "firm_workers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_accident" ADD CONSTRAINT "car_accident_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_accident" ADD CONSTRAINT "car_accident_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "firm_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_firmid_fkey" FOREIGN KEY ("firmid") REFERENCES "firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_for_car" ADD CONSTRAINT "services_for_car_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_for_car" ADD CONSTRAINT "services_for_car_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_for_car" ADD CONSTRAINT "services_for_car_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "firm_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_item" ADD CONSTRAINT "service_item_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "firm_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm" ADD CONSTRAINT "firm_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm" ADD CONSTRAINT "firm_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firm" ADD CONSTRAINT "firm_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DistrictToRegion" ADD CONSTRAINT "_DistrictToRegion_A_fkey" FOREIGN KEY ("A") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DistrictToRegion" ADD CONSTRAINT "_DistrictToRegion_B_fkey" FOREIGN KEY ("B") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
