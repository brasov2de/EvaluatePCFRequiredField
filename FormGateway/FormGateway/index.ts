import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { FormGateApp } from "./App/FormGateApp";
import React = require("react");
import ReactDOM = require("react-dom");



export class FormGate implements ComponentFramework.StandardControl<IInputs, IOutputs> {
		
	private _value ?: boolean;
	private _notifyOutputChanged : () => void;
	private _container : HTMLDivElement;
	private _messageName : string;

	constructor()
	{		
	}

	onValueChanged = (value ?:boolean ) : void => {
		if(value!==this._value){
			this._value = value;
			this._notifyOutputChanged();
		}
	}
		
	private renderContent(){
		const props = {		
			value: this._value,
			onValueChanged : this.onValueChanged, 
			messageName : this._messageName

		}
		ReactDOM.render(React.createElement(FormGateApp, props	), this._container);
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{		
		this._value = context.parameters.targetProperty.raw;
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		this._messageName = context.parameters.messageName.raw || "ORBIS.FormGate";
		this.renderContent();
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		/*
		if(context.parameters.targetProperty.raw!==this._value){
			this._value = context.parameters.targetProperty.raw;
		this.renderContent();
		}*/
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return { 
			targetProperty: this._value === true ? true : undefined
		}; //undefined will delete the value. When valid set the target property on != null
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		
	}
}