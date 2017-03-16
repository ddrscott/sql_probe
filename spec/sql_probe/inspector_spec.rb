require 'spec_helper'

module SqlProbe
  describe Inspector do
    subject { Inspector.new(sql) }

    context '#insert_table' do
      describe 'with values, no double quotes' do
        let(:sql) { 'INSERT INTO foo VALUES (?)' }
        it 'returns foo' do
          expect(subject.insert_table).to eq('foo')
        end
      end

      describe 'with values, double quotes' do
        let(:sql) { %{INSERT INTO "foo" VALUES (?)} }
        it 'returns foo' do
          expect(subject.insert_table).to eq('foo')
        end
      end

      describe 'with values, double quotes and space' do
        let(:sql) { %{INSERT INTO "foo bar" VALUES (?)} }
        it 'returns foo bar' do
          expect(subject.insert_table).to eq('"foo bar"')
        end
      end
    end

    context '#update_table' do
      describe 'with values, no double quotes' do
        let(:sql) { 'UPDATE foo SET column1 = ?' }
        it 'returns foo' do
          expect(subject.update_table).to eq('foo')
        end
      end

      describe 'with values, double quotes' do
        let(:sql) { %(UPDATE "foo" SET column1 = ?) }
        it 'returns foo' do
          expect(subject.update_table).to eq('foo')
        end
      end

      describe 'with values, double quotes and space' do
        let(:sql) { %(UPDATE "foo bar" SET column1 = ?) }
        it 'returns foo bar' do
          expect(subject.update_table).to eq('"foo bar"')
        end
      end
    end

    context '#delete_table' do
      describe 'with values, no double quotes' do
        let(:sql) { 'DELETE FROM foo' }
        it 'returns foo' do
          expect(subject.delete_table).to eq('foo')
        end
      end

      describe 'with values, no double quotes with WHERE' do
        let(:sql) { 'DELETE FROM foo WHERE column1 > ?' }
        it 'returns foo' do
          expect(subject.delete_table).to eq('foo')
        end
      end

      describe 'with values, double quotes' do
        let(:sql) { %{DELETE FROM "foo"} }
        it 'returns foo' do
          expect(subject.delete_table).to eq('foo')
        end
      end

      describe 'with values, double quotes and space' do
        let(:sql) { %{DELETE FROM "foo bar"} }
        it 'returns foo bar' do
          expect(subject.delete_table).to eq('"foo bar"')
        end
      end
    end

    context '#data_sources' do
      before do
        allow(subject).to receive(:all_data_sources).and_return(
          %w(foo bar baz)
        )
      end

      describe '#data_sources' do
        let(:sql) { %{SELECT * FROM foo JOIN (SELECT * FROM bar) USING(a)} }
        it 'returns foo and bar' do
          expect(subject.data_sources).to contain_exactly('foo', 'bar')
        end
      end
    end
  end
end
