terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "tfstate22329"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }

}

provider "azurerm" {
  features {}
}

resource "random_string" "random" {
  length  = 5
  special = false
}

resource "azurerm_resource_group" "nestjs_functions_rg" {
  name     = "nestjs-functions-rg"
  location = "eastus"
}

resource "azurerm_storage_account" "nestjs_functions_sa" {
  name                     = "mystorageaccount${random_string.random.id}"
  resource_group_name      = azurerm_resource_group.nestjs_functions_rg.name
  location                 = azurerm_resource_group.nestjs_functions_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "nestjs_functions_sp" {
  name                = "nestjs-functions-sp"
  location            = azurerm_resource_group.nestjs_functions_rg.location
  resource_group_name = azurerm_resource_group.nestjs_functions_rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "nestjs_function_app" {
  name                       = "nestjs-function-app"
  location                   = azurerm_resource_group.nestjs_functions_rg.location
  resource_group_name        = azurerm_resource_group.nestjs_functions_rg.name
  service_plan_id            = azurerm_service_plan.nestjs_functions_sp.id
  storage_account_name       = azurerm_storage_account.nestjs_functions_sa.name
  storage_account_access_key = azurerm_storage_account.nestjs_functions_sa.primary_access_key


  site_config {}
}
