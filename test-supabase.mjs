import { createClient } from '@supabase/supabase-js';

const url = 'https://rildntfwoxyeaqmbycml.supabase.co';
const key = 'sb_publishable_3Sjjgxos1ZbVshBtLnQqHw_TPlGqpXa';

const supabase = createClient(url, key);

async function test() {
  try {
    const { data: insertData, error: insertError } = await supabase
      .from('notes')
      .insert([{ title: 'Test Note', type: 'text', content: 'Testing Supabase connection from script' }])
      .select();

    if (insertError) {
      console.error('Insert Failed:', insertError);
      return;
    }
    console.log('Insert Success:', insertData);

    const { data: selectData, error: selectError } = await supabase
      .from('notes')
      .select('*');

    if (selectError) {
      console.error('Select Failed:', selectError);
      return;
    }
    console.log('Select Success. Total notes:', selectData.length);
    
    // Clean up
    if (insertData && insertData.length > 0) {
      await supabase.from('notes').delete().eq('id', insertData[0].id);
      console.log('Cleanup Success');
    }

  } catch (err) {
    console.error('Exception:', err);
  }
}

test();
