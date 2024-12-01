-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredients" TEXT[],
    "servings" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dishType" TEXT[],
    "cuisineType" TEXT[],
    "healthLabels" TEXT[],
    "totalTime" INTEGER NOT NULL,
    "apiLink" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YourRecipes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredients" TEXT[],
    "servings" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dishType" TEXT[],
    "cuisineType" TEXT[],
    "healthLabels" TEXT[],
    "totalTime" INTEGER NOT NULL,
    "apiLink" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "notes" TEXT[],

    CONSTRAINT "YourRecipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "YourRecipes" ADD CONSTRAINT "YourRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
