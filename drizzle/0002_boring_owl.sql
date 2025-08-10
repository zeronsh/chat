ALTER TYPE "public"."icon" ADD VALUE 'moonshot';

COMMIT;

UPDATE "public"."model" SET "icon" = 'moonshot' WHERE "id" = 'kimi-k2';
