defmodule Agora.Repo.Migrations.CreateThread do
  use Ecto.Migration

  def change do
    create table(:threads) do
      add :title, :string
      add :account_id, references(:accounts, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)
      add :parent_group_id, references(:groups, on_delete: :nothing)

      timestamps
    end
    create index(:threads, [:account_id])
    create index(:threads, [:user_id])
    create index(:threads, [:parent_group_id])

  end
end
