class CreateDummyTables < ActiveRecord::Migration
  def change
    create_table :homes do |t|
      t.string :address

      t.timestamps null: false
    end

    create_table :windows do |t|
      t.belongs_to :home, index: true
      t.string :dimensions

      t.timestamps null: false
    end
  end
end
