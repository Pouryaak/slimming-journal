import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// --- CONFIGURATION ---

const TARGET_USER_EMAIL = 'admin@admin.com';
const DAYS_TO_SEED = 90;

// =================================================================================
// MAIN SEEDING FUNCTION
// =================================================================================
async function seed() {
  console.log('🌱 Starting database seed process...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase URL or service role key is missing from .env.local',
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log('✅ Supabase admin client created.');

  try {
    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const targetUser = users.find((u) => u.email === TARGET_USER_EMAIL);

    if (!targetUser) {
      throw new Error(`Could not find user with email: ${TARGET_USER_EMAIL}`);
    }

    const userId = targetUser.id;
    console.log(`👤 Found user: ${userId}`);

    console.log(`✍️ Generating ${DAYS_TO_SEED} days of check-in data...`);
    const dailyData = [];
    const weeklyData = [];

    // Start from today and go backwards in time
    for (let i = 0; i < DAYS_TO_SEED; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const dateString = currentDate.toISOString().slice(0, 10);

      dailyData.push({
        user_id: userId,
        date: dateString,
        calories_goal: 2000,
        calories_consumed: faker.number.int({ min: 1800, max: 2200 }),
        protein_consumed_g: faker.number.int({ min: 120, max: 180 }),
        steps: faker.number.int({ min: 5000, max: 15000 }),
        water_ml: faker.number.int({ min: 1500, max: 3000 }),
        calories_burned: faker.number.int({ min: 200, max: 600 }),
        carbs_consumed_g: faker.number.int({ min: 20, max: 300 }),
      });

      if (currentDate.getDay() === 6) {
        weeklyData.push({
          user_id: userId,
          date: dateString,
          weight_kg: faker.number.float({
            min: 68,
            max: 72,
            fractionDigits: 3,
          }),
          muscle_mass_kg: faker.number.float({
            min: 20,
            max: 55,
            fractionDigits: 3,
          }),
          body_fat_percentage: faker.number.float({
            min: 10,
            max: 30,
            fractionDigits: 3,
          }),
        });
      }
    }
    console.log('✅ Fake data generated.');

    // 4. INSERT DATA INTO THE DATABASE
    // We insert all rows at once for better performance (bulk insert).

    console.log('🗑️ Deleting old check-in data for this user...');
    await supabaseAdmin.from('daily_checkins').delete().eq('user_id', userId);
    await supabaseAdmin.from('weekly_checkins').delete().eq('user_id', userId);

    console.log(' Inserting new daily check-ins...');
    const { error: dailyError } = await supabaseAdmin
      .from('daily_checkins')
      .insert(dailyData);
    if (dailyError) throw dailyError;

    console.log(' Inserting new weekly check-ins...');
    const { error: weeklyError } = await supabaseAdmin
      .from('weekly_checkins')
      .insert(weeklyData);
    if (weeklyError) throw weeklyError;

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ An error occurred during the seed process:');
    console.error(error);
  }
}

// Run the seed function
seed();
